import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { CustomLogger, MessageType } from "../util/CustomUiLogger";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controls
 */
export default class ItemV2 extends Control {
    public static readonly metadata = {
        properties: {
            text: { type: "string", defaultValue: "" },
        },
    };

    public static readonly renderer = {
        apiVersion: 2,
        render(rm: RenderManager, item: ItemV2): void {
            CustomLogger.addV2Message({
                message: `Item:render (${item.getText()})`,
                type: MessageType.Warning,
            });
            rm.openStart("div", item);
            rm.openEnd();
            rm.text(item.getText());
            rm.close("div");
        },
    };
}
