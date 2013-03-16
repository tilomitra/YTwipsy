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

        POINTER_TEMPLATE = '<div class="' + CLASSES.pointer + '"></div>'

        //HTML5 Data Attributes
        DATA_CONTENT = 'data-content',
        DATA_point = 'data-point';

    function Pointer() {

        //  Widget method overlap
        Y.after(this._renderUIPointer, this, "renderUI");
        Y.after(this._bindUIPointer, this, "bindUI");
        Y.after(this._syncUIPointer, this, "syncUI");

    }

    Pointer.ATTRS = {
        point : {
            value: 'above'
        },
        
        pointerTemplate: {
            value: POINTER_TEMPLATE,
            validator: Y.Lang.isString
        },



    };

    Pointer.prototype = {

        _renderUIPointer: function () {
            var box = this.get('boundingBox');
            this._pointer = Y.Node.create(this.get('pointerTemplate'));
            this._pointer.addClass(this._getArrowType(this.get('point')));

            box.prepend(this._pointer);
        },

        _bindUIPointer: function () {
            this.after('pointChange', this._afterPointChange);
        },

        _syncUIPointer: function () {
            var box = this.get('boundingBox'),
                point = this.get('point'),
                arrowClass = this._getArrowType(point);
        
            this._alignPointer(box, this._pointer, point);

        },

        _getArrowType : function (point) {
            var arrowClass = '';

            //Remember that the arrow must be pointing in the opposite direction of point! :)
            switch (point) {
                case "below":
                    arrowClass = CLASSES.below;
                    break;
                case "right":
                    arrowClass = CLASSES.right;
                    break;
                case "above":
                    arrowClass = CLASSES.above;
                    break;
                case "left":
                    arrowClass = CLASSES.left;
                    break;
                default:
                    Y.log("A correct point parameter was not specified. Accepted points are 'above', 'below', 'left' and 'right'.");
                    break;
            }
            
            return arrowClass;
        },

        _alignPointer : function (node, pointer, point) {
            pointer.plug(Y.Plugin.Align);
            
            switch (point) {
                case "below":
                    pointer.align.to(node, "bc", "tc", true);
                    break;
                case "right":
                    pointer.align.to(node, "rc", "lc", true);
                    break;
                case "above":
                    pointer.align.to(node, "tc", "bc", true);
                    break;
                case "left":
                    pointer.align.to(node, "lc", "rc", true);
                    break;
                default:
                    Y.log("A correct alignment was not specified. Accepted alignments are 'above', 'below', 'left' and 'right'.");
                    break;
            }
            
            return pointer;
        },

        _afterPointChange: function (e) {
            var className = this._getArrowType(e.newVal),
                prevClassName = CLASSES[e.prevVal] || '',
                box = this.get('boundingBox');

            if (prevClassName.length >= 1) {
                this._pointer.removeClass(prevClassName);
            }
            this._pointer.addClass(className);
            this._alignPointer(box, this._pointer, e.newVal);
        }
        
    };

    Y.WidgetPointer = Pointer;

}, "0.1", { requires : ["widget", "base-build", "align-plugin", "classnamemanager"] });
