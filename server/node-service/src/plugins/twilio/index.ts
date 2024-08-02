import { dirToSpecList, specsToOptions } from "../../common/util";
import _ from "lodash";
import path from "path";
import { OpenAPI } from "openapi-types";
import { ConfigToType, DataSourcePlugin, QueryConfig } from "lowcoder-sdk/dataSource";
import { runOpenApi } from "../openApi";
import { parseMultiOpenApi, ParseOpenApiOptions } from "../openApi/parse";


const specs = {
  "twilio--V": dirToSpecList(path.join(__dirname, "./twilio.spec")),
  "did--V": dirToSpecList(path.join(__dirname, "./did.spec")),
}

const dataSourceConfig = {
  type: "dataSource",
  params: [
    {
      type: "textInput",
      key: "accountSid_authToken.username",
      label: "SID",
      placeholder: "<SID>",
    },
    {
      type: "password",
      key: "accountSid_authToken.password",
      label: "Secret",
      placeholder: "<Secret>",
    },
    {
      label: "Spec Version",
      key: "specVersion",
      type: "select",
      tooltip: "Version of the spec file.",
      placeholder: "v1.0",
      options: specsToOptions(specs)
    },
  ],
} as const;

const parseOptions: ParseOpenApiOptions = {
  actionLabel: (method: string, path: string, operation: OpenAPI.Operation) => {
    return _.upperFirst(operation.operationId || "");
  },
};

let queryConfig: QueryConfig;

type DataSourceConfigType = ConfigToType<typeof dataSourceConfig>;

const twilioPlugin: DataSourcePlugin<any, DataSourceConfigType> = {
  id: "twilio",
  name: "Twilio",
  icon: "twilio.svg",
  category: "api",
  dataSourceConfig,

  queryConfig: async (data) => {
    console.log(data.specVersion);
    // if (!queryConfig) {
      const { actions, categories } = await parseMultiOpenApi(specs[data.specVersion as keyof typeof specs], parseOptions);
      queryConfig = {
        type: "query",
        label: "Action",
        categories: {
          label: "Resources",
          items: categories,
        },
        actions,
      };
    // }
    return queryConfig;
  },

  run: function (actionData, dataSourceConfig): Promise<any> {
    const runApiDsConfig = {
      url: "",
      serverURL: "",
      dynamicParamsConfig: dataSourceConfig,
      specVersion: dataSourceConfig.specVersion,
    };
    return runOpenApi(actionData, runApiDsConfig, specs[dataSourceConfig.specVersion as keyof typeof specs]);
  },
};

export default twilioPlugin;
