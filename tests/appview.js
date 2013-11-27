(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["backbone-appview", "backbone"], factory);
    } else {
        factory(root.BackboneAppview);
    }
}(this, function factory(BackboneAppview) {
    describe("Ensure dependencies are loaded", function() {
        it("Appview exists", function() {
            expect(BackboneAppview).not.toBe(undefined);
        });

        it("Backbone exists", function() {
            expect(Backbone).not.toBe(undefined);
        });

        it("Underscore exists", function() {
            expect(_).not.toBe(undefined);
        });

        it("jQuery exists", function() {
            expect(jQuery).not.toBe(undefined);
        });
    });

    describe("Initialization", function() {
        it("can be initialized without an anchor", function() {
            var appview = new BackboneAppview();
            expect(appview.getAnchor()).toBe("#content");
        });

        it("can be initialized with an anchor", function() {
            var appview = new BackboneAppview(".anchor");
            expect(appview.getAnchor()).toBe(".anchor");
        });

        describe("with context", function() {
            var view = null;

            beforeEach(function() {
                view = new Backbone.View;
            });

            it("can be initialized without an anchor and with a context", function() {
                var appview = new BackboneAppview(null, view.el);
                expect(appview.getContext()).toBe(view.el);
            });

            it("can be initialized with an anchor and with a context", function() {
                var appview = new BackboneAppview(".anchor", view.el);
                expect(appview.getContext()).toBe(view.el);
            });
        });
    });

    describe("showView", function() {
        var appview = null,
            view = null;

        beforeEach(function() {
            view = new Backbone.View;
        });

        var tests = function() {
            it("can be called without options", function() {
                appview.showView(view);
                expect(appview.currentView).toBe(view);
            });

            it("can get jQuery anchor element", function() {
                var element = appview.getAnchorElement();
                var expected = $(appview.getAnchor(), appview.getContext());
                expect(element).toEqual(expected);
            });

            it("can set anchor", function() {
                appview.setAnchor(".new-anchor");
                expect(appview.getAnchor()).toBe(".new-anchor");
            });

            it("can set context", function() {
                var newView = new Backbone.View;
                appview.setContext(newView.el);
                expect(appview.getContext()).toBe(newView.el);
            });

            describe("with callbacks", function() {
                var callback = null;

                beforeEach(function() {
                    callback = jasmine.createSpy("callback");
                });

                it("calls beforeRender", function() {
                    appview.showView(view, {
                        beforeRender: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("calls afterRender", function() {
                    appview.showView(view, {
                        afterRender: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("calls beforeShow", function() {
                    appview.showView(view, {
                        beforeShow: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("calls afterShow", function() {
                    appview.showView(view, {
                        afterShow: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("calls first", function() {
                    appview.showView(view, {
                        first: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("calls last", function() {
                    appview.showView(view, {
                        last: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });

                it("does not call onNoShow", function() {
                    appview.showView(view, {
                        onNoShow: callback
                    });
                    expect(callback).not.toHaveBeenCalled();
                });

                it("calls onNoShow", function() {
                    appview.showView(view);
                    appview.showView(view, {
                        onNoShow: callback
                    });
                    expect(callback.calls.length).toEqual(1);
                });
            });

            it("executes expected callbacks in correct order", function() {
                var order = [];
                var obj = {
                    first: function() {
                        order.push('first');
                    }
                    , beforeRender: function() {
                        order.push('beforeRender');
                    }
                    , afterRender: function() {
                        order.push('afterRender');
                    }
                    , beforeShow: function() {
                        order.push('beforeShow');
                    }
                    , afterShow: function() {
                        order.push('afterShow');
                    }
                    , last: function() {
                        order.push('last');
                    }
                };

                appview.showView(view, obj);

                expect(order).toEqual([
                    'first'
                    , 'beforeRender'
                    , 'afterRender'
                    , 'beforeShow'
                    , 'afterShow'
                    , 'last']);
            });

            describe("rendering", function() {
                var render = null;

                beforeEach(function() {
                    spyOn(view, "render");
                    render = view.render;
                });

                it("calls render", function() {
                    appview.showView(view);
                    expect(render.calls.length).toEqual(1);
                });

                it("doesn't call render when doRender is false", function() {
                    appview.showView(view, {
                        doRender: false
                    });
                    expect(render).not.toHaveBeenCalled();
                });

                it("does not show view if already shown", function() {
                    appview.showView(view);
                    appview.showView(view);
                    expect(render.calls.length).toEqual(1);
                });

                it("shows view when forced", function() {
                    appview.showView(view);
                    appview.showView(view, {
                        force: true
                    });
                    expect(render.calls.length).toEqual(2);
                });
            });

            describe("swapping a view", function() {
                var newView = null;

                beforeEach(function() {
                    newView = new Backbone.View;
                    appview.showView(view);
                });

                it("calls remove when close not available", function() {
                    spyOn(view, "remove");
                    appview.showView(newView);
                    expect(view.remove).toHaveBeenCalled();
                });

                it("calls close on the old view when a new view is shown", function() {
                    var close = jasmine.createSpy("close");
                    view.close = close;
                    appview.showView(newView);
                    expect(close.calls.length).toEqual(1);
                });

                it("swaps out the old view for the new one", function() {
                    appview.showView(newView);
                    expect(appview.currentView).toBe(newView);
                });
            });

            it("shows a view", function() {
                appview.showView(view);
                var element = appview.getAnchorElement();
                expect(element.length).toEqual(1);
                expect($(view.el, element)[0]).toBe(view.el);
            });
        };

        describe("with default initialization", function() {
            var content = $("<div id='content'>");

            beforeEach(function() {
                $("body").empty();
                $("body").append(content);
                appview = new BackboneAppview();
            });

            it("has appropriate anchor and context", function() {
                expect($("body").length).toEqual(1);
                expect(content.length).toEqual(1);
                expect(content.attr('id')).toEqual("content");
                expect($("#content").length).toEqual(1);
            });

            it("can get anchor", function() {
                expect(appview.getAnchor()).toBe("#content");
            });

            it("can get context", function() {
                expect(appview.getContext()).toBeUndefined();
            });

            tests();
        });

        describe("with non standard initialization", function() {
            var context = new Backbone.View;
            $("body").append(context.el);
            $(context.el).append($("<div class='anchor'>"));

            beforeEach(function() {
                appview = new BackboneAppview(".anchor", context.el);
            });

            it("has appropriate anchor and context", function() {
                expect($(context.el, $("body")).length).toEqual(1);
                expect($(".anchor", context.el).length).toEqual(1);
            });

            it("can get anchor", function() {
                expect(appview.getAnchor()).toBe(".anchor");
            });

            it("can get context", function() {
                expect(appview.getContext()).toBe(context.el);
            });

            tests();
        });
    });
}));


