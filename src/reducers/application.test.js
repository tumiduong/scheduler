import appReducer from "reducers/application";

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => appReducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});