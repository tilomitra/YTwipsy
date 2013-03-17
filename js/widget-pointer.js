/**
 * Extension enabling a Widget to have a pointer along a given edge.
 *
 * @module widget-pointer
 */
YUI.add('widget-pointer', function(Y, NAME) {

    var Lang = Y.Lang,
        getCN = Y.ClassNameManager.getClassName,
        UPARROW = "pointer-up",
        DOWNARROW = "pointer-down",
        LEFTARROW = "pointer-left",
        RIGHTARROW = "pointer-right",
        POINTER = 'pointer',
        WIDGET = 'widget',

        CLASSES = {
            pointer: getCN(WIDGET, POINTER),
            above: getCN(WIDGET, UPARROW),
            below: getCN(WIDGET, DOWNARROW),
            left: getCN(WIDGET, LEFTARROW),
            right: getCN(WIDGET, RIGHTARROW)
        },

        POINTER_TEMPLATE = '<div class="' + CLASSES.pointer + '"></div>',

        //HTML5 Data Attributes
        DATA_POINT = 'data-point';

    function Pointer() {

        //  Widget method overlap
        Y.after(this._renderUIPointer, this, "renderUI");
        Y.after(this._bindUIPointer, this, "bindUI");
    }

    Pointer.ATTRS = {
        point : {
            value: 'above'
        }
    };

    Pointer.prototype = {

        destructor: function () {
            this._pointer.unplug(Y.Plugin.Align);
        },

        _renderUIPointer: function () {
            var box = this.get('boundingBox');
            this._pointer = Y.Node.create(POINTER_TEMPLATE);
            box.prepend(this._pointer);
            this._pointer.plug(Y.Plugin.Align);
        },

        _bindUIPointer: function () {
            this.after('pointChange', this._afterPointChange);
        },


        _getArrowType : function (point) {
            var arrowClass = '';

            //Remember that the arrow must be pointing in the opposite direction of point! :)
            switch (point) {
                case "below":
                    arrowClass = CLASSES.above;
                    break;
                case "right":
                    arrowClass = CLASSES.left;
                    break;
                case "above":
                    arrowClass = CLASSES.below;
                    break;
                case "left":
                    arrowClass = CLASSES.right;
                    break;
                default:
                    Y.log("A correct point parameter was not specified. Accepted points are 'above', 'below', 'left' and 'right'.");
                    break;
            }
            
            return arrowClass;
        },

        alignPointer : function (node) {
            
            var point = node.getAttribute(DATA_POINT) || this.get('point'),
                box = this.get('boundingBox'),
                arrowClass = this._getArrowType(point);

            this._pointer.set('className', '').addClass(CLASSES.pointer + " " + arrowClass);

            switch (point) {
                case "below":
                    this._pointer.align.to(box, "tc", "bc", true);
                    break;
                case "right":
                    this._pointer.align.to(box, "lc", "rc", true);
                    break;
                case "above":
                    this._pointer.align.to(box, "bc", "tc", true);
                    break;
                case "left":
                    this._pointer.align.to(box, "rc", "lc", true);
                    break;
                default:
                    Y.log("A correct alignment was not specified. Accepted alignments are 'above', 'below', 'left' and 'right'.");
                    break;
            }            
        },


        _afterPointChange: function (e) {
            var arrowClass = this._getArrowType(e.newVal);
            this._pointer.set('className', '').addClass(CLASSES.pointer + " " + arrowClass);
            this.alignPointer();
        }
        
    };

    Y.WidgetPointer = Pointer;

}, "0.1", { requires : ["widget", "base-build", "align-plugin", "classnamemanager"] });
