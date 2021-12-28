
import { ObjectMultiMap } from '../src/objectMap';

const obj1 = {
  openId: 6,
  appId: 4,
}
const obj2 = {
  openId: 6,
  appId: 5,
}
const obj3 = {
  openId: 4,
  appId: 5,
}

it("could be created", () => {
  new ObjectMultiMap(["233"])
  new ObjectMultiMap({233: "", "666": ""})
})

it("should check input error", () => {
  expect(() => new ObjectMultiMap(-1 as any)).toThrow()
  expect(() => new ObjectMultiMap(0 as any)).toThrow()
  expect(() => new ObjectMultiMap("test" as any)).toThrow()
  expect(() => new ObjectMultiMap(undefined as any)).toThrow()
  expect(() => new ObjectMultiMap([])).toThrow()
  expect(() => new ObjectMultiMap({})).toThrow()
})

it("could be set and get", () => {
  const map = new ObjectMultiMap(["openId", "appId"])
  expect(map.has(obj1)).toBeFalsy()
  map.set(obj1, "233")
  map.set(obj2, "999")
  expect(map.has(obj1)).toBeTruthy()

  expect(map.has(obj3)).toBeFalsy()
  expect(map.has(obj2)).toBeTruthy()
  expect(map.has({
    appId: 4,
    openId: 6,
  })).toBeTruthy()
  expect(map.get(obj1)).toBe("233")
  expect(map.get(obj1, "888")).toBe("233")
  expect(map.get({
    appId: 4,
    openId: 6,
  })).toBe("233")
  expect(map.get(obj2)).toBe("999")
  expect(map.get(obj2, "888")).toBe("999")
  expect(map.get(obj3)).toBe(undefined)
  expect(map.get(obj3, "888")).toBe("888")
})

it("should throw if lens doesn't match", () => {
  const map = new ObjectMultiMap(["openId", "appId"])
  expect(() => map.set({}, "")).toThrow()
  expect(() => map.set({"openId": 234}, "")).toThrow()
  expect(() => map.get({"openId": 234, "unionId": 3444})).toThrow()
  expect(() => map.has({ openId: 234, unionId: 3444})).toThrow()
  expect(() => map.has({ openId: 234, appId: 233, unionId: 3444})).toThrow()
})

it("could delete and clear", () => {
  const map = new ObjectMultiMap(obj1)
  expect(map.size).toBe(0)
  map.set(obj1, "233")
  map.set(obj2, "2333")

  expect(map.size).toBe(2)
  expect(map.get(obj1)).toBe("233")
  expect(map.has(obj1)).toBeTruthy()

  expect(map.delete(obj1)).toBeTruthy()
  expect(map.delete(obj3)).toBeFalsy()
  
  expect(map.size).toBe(1)
  expect(map.has(obj1)).toBeFalsy()
  expect(map.get(obj1)).toBe(undefined)

  expect(map.has(obj2)).toBeTruthy()

  map.clear()
  expect(map.size).toBe(0)

  expect(map.has(obj2)).toBeFalsy()
})

it("could be foreach", () => {
  const map = new ObjectMultiMap(obj1)
  map.set(obj1, "233")
  map.set(obj2, "2333")
  map.set(obj3, "23333")

  map.forEach((v, k) => {
    expect(v).toMatchSnapshot()
    expect(k).toMatchSnapshot()
  })
})

it("could be iterable", () => {
  const map = new ObjectMultiMap(obj1)
  map.set(obj1, "233")
  map.set(obj2, "2333")
  map.set(obj3, "23333")

  for (const result of map) {
    expect(result).toMatchSnapshot()
  }
})

it("entries could be for iterable", () => {
  const map = new ObjectMultiMap(obj1)
  map.set(obj1, "233")
  map.set(obj2, "2333")
  map.set(obj3, "23333")

  expect(map.entries()).toMatchSnapshot()

  for (const result of map.entries()) {
    expect(result).toMatchSnapshot()
  }
})

it("keys could be for iterable", () => {
  const map = new ObjectMultiMap(obj1)
  map.set(obj1, "233")
  map.set(obj2, "2333")
  map.set(obj3, "23333")

  expect(map.keys()).toMatchSnapshot()

  for (const result of map.keys()) {
    expect(result).toMatchSnapshot()
  }
})

it("values could be for iterable", () => {
  const map = new ObjectMultiMap(obj1)
  map.set(obj1, "233")
  map.set(obj2, "2333")
  map.set(obj3, "23333")

  expect(map.values()).toMatchSnapshot()

  for (const result of map.values()) {
    expect(result).toMatchSnapshot()
  }
})


