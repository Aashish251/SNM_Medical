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

describe("master data deletion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes sewalocation record and sets is_deleted to 1", async () => {
    promisePool.execute
      .mockResolvedValueOnce([[{ id: 5 }]]) // existing record check
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // update query

    const res = await masterDataService.deleteItem("sewalocation", 5, 2);
    expect(res).toEqual({ id: 5, isDeleted: true });

    expect(promisePool.execute).toHaveBeenCalledTimes(2);
    const [checkSql, checkParams] = promisePool.execute.mock.calls[0];
    expect(checkSql).toContain("SELECT id FROM sewalocation_tbl WHERE id = ? AND is_deleted = 0");
    expect(checkParams).toEqual([5]);

    const [updateSql, updateParams] = promisePool.execute.mock.calls[1];
    expect(updateSql).toContain("UPDATE sewalocation_tbl SET is_deleted = 1, updated_datetime = NOW(), updated_by = ? WHERE id = ?");
    expect(updateParams).toEqual([2, 5]);
  });

  it("deletes shifttime record and sets is_deleted to 1", async () => {
    promisePool.execute
      .mockResolvedValueOnce([[{ id: 3 }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await masterDataService.deleteItem("shifttime", 3, 10);
    expect(res).toEqual({ id: 3, isDeleted: true });

    const [updateSql, updateParams] = promisePool.execute.mock.calls[1];
    expect(updateSql).toContain("UPDATE shifttime_tbl SET is_deleted = 1, updated_datetime = NOW(), updated_by = ? WHERE id = ?");
    expect(updateParams).toEqual([10, 3]);
  });

  it("deletes department record using sp_department_master stored procedure", async () => {
    promisePool.execute
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await masterDataService.deleteItem("department", 1, 4);
    expect(res).toEqual({ id: 1, isDeleted: true });

    const [spCall, spParams] = promisePool.execute.mock.calls[1];
    expect(spCall).toContain("CALL sp_department_master(?, ?, ?, ?, ?)");
    expect(spParams).toEqual(["DELETE", 1, null, 4, null]);
  });

  it("throws 404 when master record does not exist or is already deleted", async () => {
    promisePool.execute.mockResolvedValueOnce([[]]);

    await expect(masterDataService.deleteItem("sewalocation", 999)).rejects.toMatchObject({
      statusCode: 404,
      message: "Sewa Location record not found",
    });
  });

  it("throws 400 for invalid ID", async () => {
    await expect(masterDataService.deleteItem("sewalocation", "invalid")).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

describe("master data updating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates sewalocation value and audit timestamp", async () => {
    promisePool.execute
      .mockResolvedValueOnce([[{ id: 2 }]]) // check exists
      .mockResolvedValueOnce([[]]) // duplicate check
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // update query

    const res = await masterDataService.updateItem("sewalocation", 2, { value: "New Sewa Spot" }, 5);
    expect(res).toEqual({ id: 2, value: "New Sewa Spot" });

    const [updateSql, updateParams] = promisePool.execute.mock.calls[2];
    expect(updateSql).toContain("UPDATE sewalocation_tbl SET sewalocation_name = ?, updated_datetime = NOW(), updated_by = ? WHERE id = ?");
    expect(updateParams).toEqual(["New Sewa Spot", 5, 2]);
  });

  it("throws 409 when updating to an existing name in the same module", async () => {
    promisePool.execute
      .mockResolvedValueOnce([[{ id: 2 }]]) // check exists
      .mockResolvedValueOnce([[{ id: 8 }]]); // duplicate check returns match

    await expect(
      masterDataService.updateItem("sewalocation", 2, { value: "Existing Spot" }, 5)
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Sewa Location already exists",
    });
  });
});
