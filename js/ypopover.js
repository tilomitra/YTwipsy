YUI.add('popover', function(Y) {

    var getCN = Y.ClassNameManager.getClassName,
    
    DATA_TITLE = "data-title",
    
    TWIPSY = 'twipsy',
    POPOVER = 'popover',
    WRAPPER = 'wrapper',
    HEADER = 'header',
    INNER = 'inner',
    TIP = 'tip',
    FADE = 'fade',
    IN = 'in',
    UPARROW = "arrow-up",
    DOWNARROW = "arrow-down",
    LEFTARROW = "arrow-left",
    RIGHTARROW = "arrow-right",
    CLASSES = {
        tooltip: getCN(POPOVER, WRAPPER),
        header: getCN(POPOVER, HEADER),
        inner: getCN(POPOVER, INNER),
        tip: getCN(POPOVER, TIP),
        fade: getCN(POPOVER, FADE),
        fadeIn: getCN(POPOVER, IN),
        upArrow: getCN(POPOVER, UPARROW),
        downArrow: getCN(POPOVER, DOWNARROW),
        leftArrow: getCN(POPOVER, LEFTARROW),
        rightArrow: getCN(POPOVER, RIGHTARROW)
    },
    TEMPLATES = {
        wrapper: '<div class="' + CLASSES.tooltip + '"><div class="' + CLASSES.header + '">{title}</div><div class="' + CLASSES.inner + '">{content}</div></div>',
        tip: '<div class="' + CLASSES.tip + '"></div>'
    };
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
        title: {
            value: "",
            validator: Y.Lang.isString
        },
        template : {
            value: TEMPLATES.wrapper,
            validator: Y.Lang.isString
        },
        _tip: {
            value: TEMPLATES.tip,
            validator: Y.Lang.isString
        },
        
        hideOn : {              
            valueFn: function () {
                return {
                    node: undefined,
                    eventName: "clickoutside"
                }
            }
        },
        
        showOn : {
            valueFn: function () {
                return {
                    node: undefined,
                    eventName: "click"
                }
            }
        }
    };

    Y.extend(Popover, Y.Twipsy, {

        // Lifecycle methods
        _handle : undefined,
        _host   : undefined,
        
        initializer : function(cfg) {
            this._host = this.get("host");
            if (this._host.getAttribute("rel") == TWIPSY) {
                this.set("title", this._host.getAttribute(DATA_TITLE));
            }
        },
        
        _createTooltipNode : function () {
            var node = Y.Node.create(
                Y.Lang.sub(this.get("template"), {
                    content: this.get("content"),
                    title: this.get("title")
                })
            );
            return node;
        },

    });
    
    Y.Popover = Popover;

}, "0.1", { requires : ["twipsy", "event-outside"] });
