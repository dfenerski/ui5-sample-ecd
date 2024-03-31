import BindingMode from "sap/ui/model/BindingMode";
import JSONModel from "sap/ui/model/json/JSONModel";

import Device from "sap/ui/Device";

export default {
    createDeviceModel: () => {
        const oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode(BindingMode.OneWay);
        return oModel;
    },
    createLocalModel: () => {
        const oModel = new JSONModel({
            items: [
                { text: "Item 1" },
                { text: "Item 2" },
                { text: "Item 3" },
                { text: "Item 4" },
                { text: "Item 5" },
            ],
        });
        oModel.setDefaultBindingMode(BindingMode.TwoWay);
        return oModel;
    },
};
