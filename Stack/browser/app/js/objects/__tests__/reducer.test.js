import reducer from "../reducer"
import * as actions from "../actions"
import { SORT_ORDER_ASC, SORT_BY_NAME } from "../../constants"

describe("objects reducer", () => {
  it("should return the initial state", () => {
    const initialState = reducer(undefined, {})
    expect(initialState).toEqual({
      list: [],
      listLoading: false,
      sortBy: "",
      sortOrder: SORT_ORDER_ASC,
      currentPrefix: "",
      prefixWritable: false,
      shareObject: {
        show: false,
        object: "",
        url: ""
      },
      checkedList: []
    })
  })

  it("should handle SET_LIST", () => {
    const newState = reducer(undefined, {
      type: actions.SET_LIST,
      objects: [{ name: "obj1" }, { name: "obj2" }]
    })
    expect(newState.list).toEqual([{ name: "obj1" }, { name: "obj2" }])
  })

  it("should handle REMOVE", () => {
    const newState = reducer(
      { list: [{ name: "obj1" }, { name: "obj2" }] },
      {
        type: actions.REMOVE,
        object: "obj1"
      }
    )
    expect(newState.list).toEqual([{ name: "obj2" }])
  })

  it("should handle REMOVE with non-existent object", () => {
    const newState = reducer(
      { list: [{ name: "obj1" }, { name: "obj2" }] },
      {
        type: actions.REMOVE,
        object: "obj3"
      }
    )
    expect(newState.list).toEqual([{ name: "obj1" }, { name: "obj2" }])
  })

  it("should handle SET_SORT_BY", () => {
    const newState = reducer(undefined, {
      type: actions.SET_SORT_BY,
      sortBy: SORT_BY_NAME
    })
    expect(newState.sortBy).toEqual(SORT_BY_NAME)
  })

  it("should handle SET_SORT_ORDER", () => {
    const newState = reducer(undefined, {
      type: actions.SET_SORT_ORDER,
      sortOrder: SORT_ORDER_ASC
    })
    expect(newState.sortOrder).toEqual(SORT_ORDER_ASC)
  })

  it("should handle SET_CURRENT_PREFIX", () => {
    const newState = reducer(
      { currentPrefix: "test1/" },
      {
        type: actions.SET_CURRENT_PREFIX,
        prefix: "test2/"
      }
    )
    expect(newState.currentPrefix).toEqual("test2/")
  })

  it("should handle SET_PREFIX_WRITABLE", () => {
    const newState = reducer(undefined, {
      type: actions.SET_PREFIX_WRITABLE,
      prefixWritable: true
    })
    expect(newState.prefixWritable).toBeTruthy()
  })

  it("should handle SET_SHARE_OBJECT", () => {
    const newState = reducer(undefined, {
      type: actions.SET_SHARE_OBJECT,
      show: true,
      object: "a.txt",
      url: "test"
    })
    expect(newState.shareObject).toEqual({
      show: true,
      object: "a.txt",
      url: "test"
    })
  })

  it("should handle CHECKED_LIST_ADD", () => {
    const newState = reducer(undefined, {
      type: actions.CHECKED_LIST_ADD,
      object: "obj1"
    })
    expect(newState.checkedList).toEqual(["obj1"])
  })

  it("should handle SELECTED_LIST_REMOVE", () => {
    const newState = reducer(
      { checkedList: ["obj1", "obj2"] },
      {
        type: actions.CHECKED_LIST_REMOVE,
        object: "obj1"
      }
    )
    expect(newState.checkedList).toEqual(["obj2"])
  })

  it("should handle CHECKED_LIST_RESET", () => {
    const newState = reducer(
      { checkedList: ["obj1", "obj2"] },
      {
        type: actions.CHECKED_LIST_RESET
      }
    )
    expect(newState.checkedList).toEqual([])
  })
})
