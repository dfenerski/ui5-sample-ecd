# Difference in EDC - Extended Difference Calculation

In the above example there are two different renderers used, one using the API version 2 and one using version 4.

The logging and general approach are the same. The differences are the renderer API version and the implementation of the respective `(insert|remove)Item` methods.

## Implementation difference on a high level

### Rendering apiVersion: v2

Tries to update the DOM as specific and fine grained as possible, ensuring that the least amount of re-renders are triggered. Only invalidates the control if really necessary.

### Rendering apiVersion: v4

Relies on the framework and the improved rendering of v4 by simply invalidating the control and letting UI5 take care of the DOM part. No manual DOM updates are done here.

## Differences explained: when adding an Item

Based on the difference of logs you see after pressing "Add item" you might assume that there is a _lot_ more done in the API version 4. While this assumption is generally true, and there is indeed more code run. It isn't as detrimental as one might think. Though the logs are telling you, that each item is rendered, this is not the case. During each render-pass the RenderManager checks if rendering is even necessary. This happens in `RenderManager.canSkipRendering`. So when starting off with 9 items it does pass through all 9 items for API version 4 but realizes that nothing has to be rendered, this leads to only the 10th item being rendered in the end. This behavior is also described in the [apiVersion contract](https://openui5nightly.hana.ondemand.com/api/sap.ui.core.RenderManager). This is not the case for API version 2, where all the items need to be rerendered.

If you check the DOM of the items of API version 2, you will see that all of them have the attribute: `data-sap-ui-render` set. This means they need to always be rendered and cannot be skipped compared to the v4 ones, where this attribute is missing. Find reasons for why this marker was set [here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/RenderManager.js#L64-L84).

**What exactly is different now, why does API v2 have less logging going on?**

Well, due to the ineffectiveness of v2 when it comes to re-rendering, the actual insertion and deletion does not solely rely on control invalation as it is the case for v4. Instead, the setting and removing of the single aggregation is done manually, thus only triggering invalidation when really necessary. If you check out the source code, you'll notice that the implementation is slightly more complex in v2 as we update the aggregation ourselves, check for the DOM elements and decide ourselves if an invalidation is required or if we want to update the DOM / re-render the element.

If we would not make this effort, simply making use of the invalidation mechanism would result in worse performance as every element will simply be rerendered.

In fact: you can comment out all the DOM-magic in the v2 version, omit the `true` parameter which prevents validation in the aggregation API and set breakpoints in the respective renderers of `ItemV2` and `ItemV4`. You'll see that for each item of v2 the renderer of the item is executed, effectively re-rendering every item, while on the v4 version, only the next new item is rendered. Doing this will also make the logs look the same now, even though they are far from being the same in the background!

**But why not simply use the implementation of v2 then?**

Great question. Generally because, if you check out the documentation or source code of UI5, you'll notice that most of the APIs used there aren't recommended anymore. You will often come across sentences like:

- "The recommended alternative is to rely on invalidation and standard re-rendering." -[here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/Element.js#L569-L577)
- "...synchronously rendering UI updates is no longer supported as it can lead to unnecessary intermediate DOM updates or layout shifting etc. Controls should rather use invalidation." -[here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/Core.js#L1513-L1526)

So, TL;DR: due to sync APIs, sync rendering and because making use of invalidation and letting the framework handle the rest seems to be the recommended approach.

## Notes

- Even though the explanation above is focused on the `insert` part, the same goes for the removal of an element.
- When speaking of re-rendering in v2, remember that v2 does support in-place DOM patching so we're not saying "complete" re-render on a technical level but simply that the renderer of a given child is executed.

## More information

- UI5 source code example implementation (Renderer v2):
  - [Enabling ECD](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.f/src/sap/f/GridContainer.js#L357-L363)
  - [(insert|remove)Item](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.f/src/sap/f/GridContainer.js#L653-L712)
  - [Handling 3rd Party Hooks on aggregations](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.f/src/sap/f/GridContainer.js#L633-L639), see also [ManagedObjectObserver](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/base/ManagedObjectObserver.js) (there are no official docs ... 💙)
- `invalidate` [origin parameter](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/Control.js#L337-L346)
- [Rendering API Contract](https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.RenderManager)
  - [apiVersion2 vs apiVersion4 Announcement Blog Post](https://community.sap.com/t5/technology-blogs-by-sap/ui5-rendering-the-next-big-step-towards-a-better-performance/ba-p/13566686)
- ECD in ListBindings:
  - [ClientListBinding.getCurrentContexts](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/model/ClientListBinding.js#L213-L220)
  - [ClientListBinding.getContexts (see diffing)](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/model/ClientListBinding.js#L175-L211)
  - [ListBinding Base, diffing](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/model/ListBinding.js#L441-L453)