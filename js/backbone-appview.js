// Backbone-Appview.js 0.1.0

// (c) 2013 Evan Stern
// Backbone-Appview may be freely distributed under the MIT license.

(function(root, factory) {
    // Export as a module if AMD is available through `define` or else attach
    // it to the `root` object (generally `window`)
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.BackboneAppview = factory();
    }
}(this, function() {

    // All the default hooks.
    var defaults = {

        // Run before the view is rendered.
        beforeRender: function() {},

        // Run after the view is rendered.
        afterRender: function() {},

        // Run before the view is attached to the DOM
        beforeShow: function() {},

        // Run after the view is attached to the DOM
        afterShow: function() {},

        // Run if the view is not attached to the DOM (this can happen if the
        // view is already being shown)
        onNoShow: function() {},

        // The absolute first thing run during `showView`
        first: function() {},

        // The absolute last thing run during `showView`
        last: function() {},

        // Force the view to be rendered and shown even if it has already been
        // attached to the DOM
        force: false,

        // Should the view be rendered before it is attached?
        doRender: true
    };

    // BackboneAppView
    // ---------------
    //
    // Given an anchor and a context an instance of `BackboneAppview` will
    // become a view manager by keeping track of the active view, rendering new
    // views, closing old ones, etc.
    //
    var BackboneAppview = function(anchor, context) {
        anchor || (anchor = "#content");

        // Getter for anchor
        this.getAnchor = function() {
            return anchor;
        };

        // Setter for anchor
        this.setAnchor = function(value) {
            anchor = value;
        };

        // Getter for context
        this.getContext = function() {
            return context;
        };

        // Setter for context
        this.setContext = function(value) {
            context = value;
        };

        // Get the jQuery anchor element
        this.getAnchorElement = function() {
            return $(anchor, context);
        };

        // # showView
        //
        // Render and show a view. The available options are defined in the
        // `defaults` above.
        //
        this.showView = function(view, options) {
            options || (options = {});
            options = _.defaults(options, defaults);

            options.first();

            if ((this.currentView != view) || options.force) {
                if (this.currentView) {
                    if (this.currentView.close) {
                        this.currentView.close();
                    } else {
                        this.currentView.remove();
                    }
                }
                this.currentView = view;

                options.beforeRender();
                options.doRender && this.currentView.render();
                options.afterRender();

                options.beforeShow();
                this.getAnchorElement().empty().append(this.currentView.el);
                options.afterShow();
            } else {
                options.onNoShow();
            }
            options.last();
        };
    };

    return BackboneAppview;
}));
