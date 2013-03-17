/*
 * YTwipsy
 * 
 * Version 0.1
 *
 * YTwipsy is a tooltip for the YUI3 Library that tries to replicate behavior of Twipsy,
 * the popular tooltip from Twitter's Bootstrap. (http://twitter.github.com/bootstrap/javascript.html#twipsy)
 *
 * Tilo Mitra
 * Copyright (c) 2011 Tilo Mitra [www.tilomitra.com]
 * YUI BSD License - http://developer.yahoo.com/yui/license.html
 */
YUI.add('twipsy', function(Y) {

    
    var getCN = Y.ClassNameManager.getClassName,
    
    //HTML5 Data Attributes
    DATA_CONTENT = 'data-content',
    DATA_POINT = 'data-point',
    
    //Classes
    TWIPSY = 'twipsy',
    FADE = 'fade',
    IN = 'in',
    
    CLASSES = {
        fade: getCN(TWIPSY, FADE),
        fadeIn: getCN(TWIPSY, IN)
    };
    
    
    Y.Twipsy = Y.Base.create("twipsy", Y.Widget, [Y.WidgetPointer, Y.WidgetPosition, Y.WidgetPositionAlign], {

        _handles    : [],

        //constructor
        initializer : function(config) {
            var showOn = this.get("showOn"),
                hideOn = this.get("hideOn"),
                showOnEvents = showOn.events.split(" "),
                hideOnEvents = hideOn.events.split(" "),
                i,
                node,
                currentNode = {
                    node: undefined,
                    content: undefined
                };

            // this._host = this.get("host");

            // //Get attributes from the host node and over-write the ATTRS if necessary
            // if (this._host.getAttribute("rel") == TWIPSY) {
            //     this.set("content", this._host.getAttribute(DATA_CONTENT));
            //     this.set("placement", this._host.getAttribute(DATA_PLACEMENT));
            // }
            

        },

        //clean up on destruction
        destructor : function() {
            Y.each(this._handles, function(v, k, o) {
                v.detach();
            });
        },

        renderUI : function () {
            this.get('boundingBox').addClass(CLASSES.fade);
        },

        bindUI : function () {
            var i,
                setEnabledTrueFn = function (e) {
                    e.preventDefault();
                    this.set("isEnabled", true);
                },
                setEnabledFalseFn = function (e) {
                    e.preventDefault();
                    this.set("isEnabled", false);
                },
                del = this.get('delegate'),
                box = this.get('boundingBox'),
                selector = this.get('selector');


            //Set actions to be taken on enabledChange
            //this._handles.push(this.on("isEnabledChange", this.handleEnableChange, this));
            


            // //Determine show triggers based on showOn object
            // for (i = 0; i < showOnEvents.length; i++) {
            //     node = (showOn.node) ? showOn.node : box;
            //     this._handles.push(node.on(showOnEvents[i], setEnabledTrueFn, this));
            // }

            // //Determine hide triggers based on hideOn object
            // for (i = 0; i < hideOnEvents.length; i++) {
            //     node = (hideOn.node) ? hideOn.node : box;
            //     this._handles.push(node.on(hideOnEvents[i], setEnabledFalseFn, this));
            // }

            this._handles.push(del.delegate(['mouseover', 'touchstart'], this._handleDelegateStart, selector, this));
            
            

        },

        syncUI : function () {
        },

        _handleDelegateStart : function (e) {
            var del = this.get('delegate'),
                selector = this.get('selector');

            this._handles.push(del.delegate(['mouseout', 'touchend'], this._handleDelegateEnd, selector, this));

            var node = e.currentTarget;
            this.showTooltip(node);
        },

        _handleDelegateEnd: function (e) {
            var node = e.currentTarget;
            this.hideTooltip(node);
        },

        showTooltip : function (node) {
            this._setTooltipContent(node);
            this._alignTooltip(node);
            this.alignPointer(node);
            this.get('boundingBox').addClass(CLASSES.fadeIn);
        },
        
        hideTooltip : function (node) {
            this.get('boundingBox').removeClass(CLASSES.fadeIn);
        },
        
        _setTooltipContent: function (node) {
            var content = node.getAttribute(DATA_CONTENT) || this.get('content'),
                contentBox = this.get('contentBox');

            contentBox.setContent(content);
        },
        
        _alignTooltip : function (node) {
            var point = node.getAttribute(DATA_POINT) || this.get('point');

            switch (point) {
                case "above":
                    this.align(node, ["bc", "tc"]);
                    break;
                case "left":
                    this.align(node, ["rc", "lc"]);
                    break;
                case "below":
                    this.align(node, ["tc", "bc"]);
                    break;
                case "right":
                    this.align(node, ["lc", "rc"]);
                    break;
                default:
                    break;
            }            
        }
    },
    {
        NS : "twipsy",
        OFFSET_X: -9999,
        OFFSET_Y: -9999,

        ATTRS : {
            content : { 
                value : '',
                validator: Y.Lang.isString 
            },

            selector: {
                value: null
            },
            
            hideOn : {              
                valueFn: function () {
                    return {
                        node: undefined,
                        events: "mouseout blur"
                    };
                }
            },
            
            showOn : {
                valueFn: function () {
                    return {
                        node: undefined,
                        events: "mouseover focus"
                    };
                }
            },
            
            delegate: {
                value: null,
                setter: function(val) {
                    return Y.one(val) || Y.one("document");
                }
            }
        }
    });
}, "0.1", { requires : ["widget", "widget-position-align", "widget-pointer", "widget-stack", "classnamemanager"] 
});
