import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import ChangeReason from "sap/ui/model/ChangeReason";
import Item from "./ItemV4";
import { CustomLogger, MessageType, Version } from "../util/CustomUiLogger";

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
    };

    public static readonly renderer = {
        apiVersion: 4,
        render(rm: RenderManager, container: ContainerV4): void {
            CustomLogger.addMessage(
                {
                    message: "CONTAINER:RENDER: entry",
                    type: MessageType.Warning,
                },
                Version.V4
            );
            rm.openStart("div", container).class("container");
            rm.openEnd();
            container.getItems().forEach((item: Item) => {
                CustomLogger.addMessage(
                    {
                        message: `CONTAINER:RENDER: item: ${item.getId()}`,
                        type: MessageType.Warning,
                    },
                    Version.V4
                );
                rm.renderControl(item);
            });
            rm.close("div");
        },
    };

    public readonly bUseExtendedChangeDetection = true;

    /**
     * This override does nothing but is useful to have it explicitly defined when doing custom aggregation stuff
     */
    public updateItems() {
        CustomLogger.addMessage(
            { message: "CONTAINER: updateItems()" },
            Version.V4
        );
        return this.updateAggregation("items", ChangeReason.Change, {});
    }

    public insertItem(item: Item, index: number): this {
        CustomLogger.addMessage(
            { message: "CONTAINER: insertItem()" },
            Version.V4
        );

        // make use of invalidation via the aggregation API
        this.insertAggregation("items", item, index);

        // you could also invalidate the specific item or the entire control
        // - this.invalidate()
        // - item.invalidate()

        // handing over a invalidation "origin" does not matter

        return this;
    }

    public removeItem(item: Item | number | string): Item | null {
        CustomLogger.addMessage(
            { message: "CONTAINER: removeItem()" },
            Version.V4
        );
        // make use of invalidation via the aggregation API
        return <Item | null>this.removeAggregation("items", item);
    }

    public override onAfterRendering(event: JQuery.Event): void {
        CustomLogger.addMessage(
            { message: "CONTAINER: onAfterRendering()" },
            Version.V4
        );
        super.onAfterRendering(event);
    }
}
