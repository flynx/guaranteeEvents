/**********************************************************************
* 
*
*
**********************************************************************/

// Guarantee that every event handler gets every event...
//
//	guaranteeEvents('event', emitter)
//	guaranteeEvents('eventA eventB ...', emitter)
//	guaranteeEvents(['eventA', 'eventB', ...], emitter)
//		-> emitter
//
//
// This will add a .clearGuaranteedQueue(..) method to the emitter that 
// will clear the event queue for a specific event.
//
// 	Clear event(s) queue(s)...
// 	emitter.clearGuaranteedQueue('event')
// 	emitter.clearGuaranteedQueue('eventA eventB ...')
// 	emitter.clearGuaranteedQueue(['eventA', 'eventB', ...])
// 		-> emitter
//
// 	Clear all queues...
// 	emitter.clearGuaranteedQueue('*')
// 		-> emitter
//
//
// NOTE: the seen stack might get quite big, this is not recommended for
// 		long running emitters...
//
var guaranteeEvents = 
module.exports =
function(names, emitter){
	names = typeof(names) == typeof('str') ? names.split(/\s+/g) : names

	// add ability to clear the queue...
	if(emitter.clearGuaranteedQueue == null){
		emitter.clearGuaranteedQueue = function(names){
			names = names == '*' ? Object.keys(this._guaranteed_queue)
				: typeof(names) == typeof('str') ? names.split(/\s+/g) 
				: names

			var that = this
			names.forEach(function(name){
				if(name in that._guaranteed_queue){
					that._guaranteed_queue[name] = []
				}
			})

			return this
		}

		emitter._guaranteed_queue = {}
	}

	names.forEach(function(name){
		// do not register twice...
		if(emitter._guaranteed_queue[name] != null){
			return
		}
		var seen = emitter._guaranteed_queue[name] = []

		emitter
			// remember each event emitted...
			.on(name, function(){
				seen.push([].slice.apply(arguments))
			})
			// call the handler with the it events missed...
			.on('newListener', function(evt, func){
				if(evt == name && seen.length > 0){
					var that = this
					seen.forEach(function(args){
						func.apply(that, args)
					})
				}
			})
	})

	return emitter
}



/**********************************************************************
* vim:set ts=4 sw=4 :                                                */
