# Difference in EDC - Extended Difference Calculation

In the above example there are two different examples, one using the renderer API version 2 and one using version 4.

The logging and general implementation are somewhat the same. The only differences are the renderer API version and the implementation of the respective `(insert|remove)Item` methods.

## Difference when adding an Item

Based on the difference of logs you see after pressing "Add item" you might assume that there is a _lot_ more done in the API version 4.
While this assumption is generally true, there is more code run. It isn't as detrimental as one might think. Though the logs are telling you, that each item is rendered, this is not the case. During each render-pass the RenderManager checks if rendering is necessary. This happens in `RenderManager.canSkipRendering`. So when starting off with 9 items it does pass through all 9 items for API version 4 but realizes that nothing has to be rendered, this leads to only the 10th item being rendered in the end. This behavior is described in the [apiVersion contract](https://openui5nightly.hana.ondemand.com/api/sap.ui.core.RenderManager). This is not the case for API version 2, where all the items would need to be fully rerendered.

If you check the DOM of the items of API version 2, you will see that all of them have the attribute: `data-sap-ui-render` set. This means they need to always be rendered and cannot be skipped compared to the v4 ones, where this attribute is missing. Find reasons for why this marker can be set [here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/RenderManager.js#L64-L84).

**What exactly is different now, why does API v2 have less logging going on?**

Well, due to the ineffectiveness of v2 when it comes to re-rendering, the actual insertion and deletion does not simply rely on control invalation as it is the case for v4. Instead, the setting and removing of the single aggregation is done completely manually, thus not triggering any invalidation. If you check out the source code, you'll quickly see it is slightly more complex in v2 as we update the aggregation ourselves, check for the DOM elements and decide ourselves if an invalidation is required or if we want to update the DOM / re-render the element.

If we would not make this effort, simply making use of the invalidation mechanism would result in worse performance as every element will simply be rerendered.

In fact: you can comment out all the DOM-magic in the v2 version, omit the `true` which prevents the validation in the aggregation API and set breakpoints in the respective renderers of `ItemV2` and `ItemV4`. You'll see that for each item of v2 the renderer of the item is executed, effectively fully re-rendering every item, while on the v4 version, only the next new item is rendered. Doing this will also make the logs look the same now, even though they are far from being the same in the background!

**But why not simply use the implementation of v2 then?**

Great question. Generally because, if you check out the documentation or source code of UI5, you'll quickly notice that most of the APIs used there aren't recommended anymore. You will often come across sentences like:

- "The recommended alternative is to rely on invalidation and standard re-rendering." -[here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/Element.js#L569-L577)
- "...synchronously rendering UI updates is no longer supported as it can lead to unnecessary intermediate DOM updates or layout shifting etc. Controls should rather use invalidation." -[here](https://github.com/SAP/openui5/blob/12d1726396f0f54b42b66c5962f83112ea035552/src/sap.ui.core/src/sap/ui/core/Core.js#L1513-L1526)

---

Even though most of the examples above were focused on the `insert` part, the same goes for the removal of an element.
