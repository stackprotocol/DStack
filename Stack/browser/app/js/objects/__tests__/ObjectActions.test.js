import React from "react"
import { shallow } from "enzyme"
import { ObjectActions } from "../ObjectActions"

describe("ObjectActions", () => {
  it("should render without crashing", () => {
    shallow(<ObjectActions object={{ name: "obj1" }} currentPrefix={"pre1/"} />)
  })

  it("should show DeleteObjectConfirmModal when delete action is clicked", () => {
    const wrapper = shallow(
      <ObjectActions object={{ name: "obj1" }} currentPrefix={"pre1/"} />
    )
    wrapper
      .find("a")
      .last()
      .simulate("click", { preventDefault: jest.fn() })
    expect(wrapper.state("showDeleteConfirmation")).toBeTruthy()
    expect(wrapper.find("DeleteObjectConfirmModal").length).toBe(1)
  })

  it("should hide DeleteObjectConfirmModal when Cancel button is clicked", () => {
    const wrapper = shallow(
      <ObjectActions object={{ name: "obj1" }} currentPrefix={"pre1/"} />
    )
    wrapper
      .find("a")
      .last()
      .simulate("click", { preventDefault: jest.fn() })
    wrapper.find("DeleteObjectConfirmModal").prop("hideDeleteConfirmModal")()
    wrapper.update()
    expect(wrapper.state("showDeleteConfirmation")).toBeFalsy()
    expect(wrapper.find("DeleteObjectConfirmModal").length).toBe(0)
  })

  it("should call deleteObject with object name", () => {
    const deleteObject = jest.fn()
    const wrapper = shallow(
      <ObjectActions
        object={{ name: "obj1" }}
        currentPrefix={"pre1/"}
        deleteObject={deleteObject}
      />
    )
    wrapper
      .find("a")
      .last()
      .simulate("click", { preventDefault: jest.fn() })
    wrapper.find("DeleteObjectConfirmModal").prop("deleteObject")()
    expect(deleteObject).toHaveBeenCalledWith("obj1")
  })




  it("should show PreviewObjectModal when preview action is clicked", () => {
    const wrapper = shallow(
      <ObjectActions 
      object={{ name: "obj1", contentType: "image/jpeg"}} 
      currentPrefix={"pre1/"} />
    )
    wrapper
      .find("a")
      .at(1)
      .simulate("click", { preventDefault: jest.fn() })
    expect(wrapper.state("showPreview")).toBeTruthy()
    expect(wrapper.find("PreviewObjectModal").length).toBe(1)
  })

  it("should hide PreviewObjectModal when cancel button is clicked", () => {
    const wrapper = shallow(
      <ObjectActions 
        object={{ name: "obj1" , contentType: "image/jpeg"}}
        currentPrefix={"pre1/"} />
    )
    wrapper
      .find("a")
      .at(1)
      .simulate("click", { preventDefault: jest.fn() })
    wrapper.find("PreviewObjectModal").prop("hidePreviewModal")()
    wrapper.update()
    expect(wrapper.state("showPreview")).toBeFalsy()
    expect(wrapper.find("PreviewObjectModal").length).toBe(0)
  })
  it("should not show PreviewObjectModal when preview action is clicked if object is not an image", () => {
    const wrapper = shallow(
      <ObjectActions 
      object={{ name: "obj1"}} 
      currentPrefix={"pre1/"} />
    )
    expect(wrapper
      .find("a")
      .length).toBe(2)
  })

  it("should call shareObject with object and expiry", () => {
    const shareObject = jest.fn()
    const wrapper = shallow(
      <ObjectActions
        object={{ name: "obj1" }}
        currentPrefix={"pre1/"}
        shareObject={shareObject}
      />
    )
    wrapper
      .find("a")
      .first()
      .simulate("click", { preventDefault: jest.fn() })
    expect(shareObject).toHaveBeenCalledWith("obj1", 5, 0, 0)
  })

  it("should render ShareObjectModal when an object is shared", () => {
    const wrapper = shallow(
      <ObjectActions
        object={{ name: "obj1" }}
        currentPrefix={"pre1/"}
        showShareObjectModal={true}
        shareObjectName={"obj1"}
      />
    )
    expect(wrapper.find("Connect(ShareObjectModal)").length).toBe(1)
  })

  it("shouldn't render ShareObjectModal when the names of the objects don't match", () => {
    const wrapper = shallow(
      <ObjectActions
        object={{ name: "obj1" }}
        currentPrefix={"pre1/"}
        showShareObjectModal={true}
        shareObjectName={"obj2"}
      />
    )
    expect(wrapper.find("Connect(ShareObjectModal)").length).toBe(0)
  })
})
