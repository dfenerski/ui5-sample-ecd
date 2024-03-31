import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import ChangeReason from "sap/ui/model/ChangeReason";
import { CustomLogger, MessageType } from "../util/CustomUiLogger";
import Item from "./ItemV4";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controls
 */
export default class ContainerV4 extends Control {
    public static readonly metadata = {
        aggregations: {
            items: {
                type: "com.github.dfenerski.ui5_sample_ecd.controls.ItemV4",
                multiple: true,
            },
        },
        defaultAggregation: "items",
    };

    public static readonly renderer = {
        apiVersion: 4,
        render(rm: RenderManager, container: ContainerV4): void {
            CustomLogger.addV4Message({
                message: "Container:render",
                type: MessageType.Information,
            });
            rm.openStart("div", container).class("container");
            rm.openEnd();
            container.getItems().forEach((item: Item) => {
                rm.renderControl(item);
            });
            rm.close("div");
        },
    };

    /**
     * Enable ECD by setting `bUseExtendedChangeDetection` flag
     */
    public readonly bUseExtendedChangeDetection = true;

    /**
     * Dedicated `updateAggregation` hook, overridden to demonstrate the lifecycle.
     */
    public updateItems() {
        CustomLogger.addV4Message({ message: "Container:updateItems" });
        return this.updateAggregation("items", ChangeReason.Change, {});
    }

    /**
     * Dedicated `insert` hook, overridden to demonstrate the lifecycle.
     * The default behavior of calling `this.insertAggregation` with invalidation enabled is enough:
     * `Item` invalidates -> `Container` invalidates -> `Container` renders but the v4 render skips any non-invalidated children.
     * This results in granular DOM update, while utilizing only the invalidation mechanism (no sync render, which is discouraged for future UI5 versions)
     */
    public insertItem(item: Item, index: number): this {
        CustomLogger.addV4Message({ message: "Container:insertItem" });
        // Make use of invalidation via the aggregation API
        return this.insertAggregation("items", item, index);
    }

    /**
     * Dedicated `remove` hook, overridden to demonstrate the lifecycle.
     * The default behavior of calling `this.removeAggregation` with invalidation enabled is enough:
     * `Item` invalidates -> `Container` invalidates -> `Container` renders but the v4 render skips any non-invalidated items.
     * This results in granular DOM update, while utilizing only the invalidation mechanism (no sync render, which is discouraged for future UI5 versions)
     */
    public removeItem(item: Item | number | string): Item | null {
        CustomLogger.addV4Message({ message: "Container:removeItem" });
        // Make use of invalidation via the aggregation API
        return <Item | null>this.removeAggregation("items", item);
    }

    /**
     * Dedicated `onAfterRendering` hook, overridden to demonstrate the lifecycle.
     */
    public override onAfterRendering(event: JQuery.Event): void {
        CustomLogger.addV4Message({ message: "Container:onAfterRendering" });
        super.onAfterRendering(event);
    }
}
