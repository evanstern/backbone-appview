(function(_, $) {

    // 'window'
    var root = this;

    // By default, all hooks are no-ops.
    var defaults = {
        // Executed before the view is rendered but after the old view is
        // closed
        beforeRender: function() {},

        // Executed after the view is rendered
        afterRender: function() {},

        // Executed before the view is attached to the DOM but after rendering
        // is completed
        beforeShow: function() {},

        // Executed after the view is attached to the DOM
        afterShow: function() {},

        // Executed if the view is not shown (it's already the active view)
        onNoShow: function() {},

        // Always the first function executed
        first: function() {},

        // Always the last function executed
        last: function() {},

        // Force the view to be redrawn and reattached even if it is already
        // the active view.
        force: false,

        // By default, we *will* render this view
        doRender: true
    };

    var AppView = root.AppView = function(anchor, context) {

        // By default, the view will be appeneded to an element called
        // `#content`.
        anchor = anchor || "#content";

        // `context` is used as a limiter of the `anchor`. That is, the view
        // will be appeneded to:
        //
        //     $(anchor, context);
        context = context || null;

        // Show the view, making sure to nicely close down the current view
        // (if any exists)
        this.showView = function(view, options) {
            options = options || {};
            options = _.defaults(options, defaults);

            options.first();

            // Show the view (if necessary). Apply any defined hooks at
            // appropriate steps.
            if (this.currentView != view || (options && options.force)) {

                // Close the old view and make this view the active one
                this.currentView && this.currentView.close();
                this.currentView = view;

                // Render the view (with before and after hooks)
                options.beforeRender();
                options.doRender && this.currentView.render();
                options.afterRender();

                // Apply the view to the DOM (with before and after hooks)
                options.beforeShow();
                $(anchor, context).empty().append(this.currentView.el);
                options.afterShow();

            } else {
                // This gets executed if the view isn't shown.
                options.onNoShow();
            }
            options.last();
        };
    };

}).call(this, _, jQuery);
