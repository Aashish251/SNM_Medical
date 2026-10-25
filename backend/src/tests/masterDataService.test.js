jest.mock("../config/database", () => ({
  promisePool: {
    execute: jest.fn(),
  },
}));

const { promisePool } = require("../config/database");
const masterDataService = require("../services/masterDataService");

describe("master data listing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns city rows with state names instead of requiring state IDs in the table", async () => {
    promisePool.execute.mockResolvedValueOnce([
      [
        {
          id: 7,
          city_name: "Example City",
          state_id: 3,
          state_name: "Example State",
        },
      ],
    ]);

    await expect(masterDataService.listItems("city")).resolves.toEqual([
      {
        id: 7,
        city_name: "Example City",
        state_id: 3,
        state_name: "Example State",
        value: "Example City",
      },
    ]);

    const [query, params] = promisePool.execute.mock.calls[0];
    expect(query).toContain("LEFT JOIN state_tbl s ON s.id = c.state_id");
    expect(query).toContain("s.state_name");
    expect(params).toEqual(["", ""]);
  });
});
