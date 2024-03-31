import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import { CustomLogger } from "../util/CustomUiLogger";
import models from "../model/models";

/**
 * @namespace com.github.dfenerski.ui5_sample_ecd.controller
 */
export default class Main extends BaseController {
    public handleItemAddition() {
        const localModel = <JSONModel>this.getModel("local");
        const items = <{ text: string }[]>localModel.getProperty("/items");
        localModel.setProperty("/items", [...items, { text: Math.random() }]);
    }

    public handleItemRemoval() {
        const localModel = <JSONModel>this.getModel("local");
        const items = <{ text: string }[]>localModel.getProperty("/items");
        const lastItemIndex = items.length - 1;
        localModel.setProperty(
            "/items",
            items.filter((_, i) => i !== lastItemIndex)
        );
    }

    public resetLogger() {
        CustomLogger.reset();
    }

    public resetModel() {
        this.setModel(models.createLocalModel(), "local");
    }

    public handleRender() {
        this.byId("containerV2").rerender();
        this.byId("containerV4").rerender();
    }
}
