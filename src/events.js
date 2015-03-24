/**
 * The Events object is similar to Backbone.Events
 * This version implements on, off and trigger methods
 * Usage: extend your custom objects with AV.Events
 */

(function() {
	
	// namespace
	this.AV = this.AV || {};
	this.AV.Events = this.AV.Events || {
		events : {},

		/**
		 * This method allows to set new events
		 * @param {String} event The name of the event
		 * @param {Function} callback
		 * @param {Object} context [optional], the context that will be applied to callback
		 */
		on : function(event, callback, context) {
			this.events[event] = this.events[event] || [];
			this.events[event].push({
				callback: callback,
				context: context || null
			});
		},

		/**
		 * Calling this method triggers event
		 * @param {String} event The name of the event
		 */
		trigger : function(event) {
			if (!this.events[event]) return;

			var callbacks = this.events[event],
				i = 0, 
				len = callbacks.length;

			for (; i < len; i++) {
				var ctx = (callbacks[i].context !== null) ? callbacks[i].context : callbacks[i];
				callbacks[i].callback.apply(ctx);
			}
		},


		/**
		 * This method allows to unregister event or array of events
		 * @param {String | Array} event The name of the event, or array of events
		 * @param {Function} callback [optional] if reference to a callback function is provided, 
		 * only that callback will be unregistered (only works when unregistering a single event)
		 */
		off : function(event, callback) {
			if (event instanceof Array) {
				for (var i = 0, ilen = event.length; i<ilen;i++) {
					this.off(event[i]);
				}
				return;
			}
			var callbacks = this.events[event],
				i = 0, 
				len = callbacks.length;
			if (!callbacks) {
				return;
			} else if (typeof callback !== "function") {
				delete this.events[event];
			} else {
				for (; i < len; i++) {
					if (callbacks[i].callback === callback) {
						callbacks.splice(i,1);
					}
				}
			}
		}
	};

}).call(this);