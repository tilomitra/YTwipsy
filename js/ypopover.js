YUI.add('popover', function(Y) {

	function Popover(config) {
	    Popover.superclass.constructor.apply(this, arguments);
	}

	/* 
	 * The namespace for the plugin. This will be the property on the widget, which will 
	 * reference the plugin instance, when it's plugged in
	 */
	Popover.NS = "popover";

	/*
	 * The NAME of the AnimPlugin class. Used to prefix events generated
	 * by the plugin class.
	 */
	Popover.NAME = "popover";

	/*
	 * The default set of attributes for the AnimPlugin class.
	 */
	Popover.ATTRS = {

	};

	Y.extend(Popover, Y.Twipsy, {

	    // Lifecycle methods
	     _handle : undefined,

		initializer : function(cfg) {

		},

		//clean up on destruction
		destructor : function() {

		}
	});
	
	Y.Popover = Popover;

}, "0.1", { requires : ["twipsy"] });
