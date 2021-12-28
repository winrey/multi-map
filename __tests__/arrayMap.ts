
import { ArrayMultiMap } from '../src/arrayMap';

it("could be created", () => {
  new ArrayMultiMap(1)
  new ArrayMultiMap(10)
})

it("should check input error", () => {
  expect(() => new ArrayMultiMap(-1)).toThrow()
  expect(() => new ArrayMultiMap(0)).toThrow()
  expect(() => new ArrayMultiMap("test" as any)).toThrow()
  expect(() => new ArrayMultiMap(undefined as any)).toThrow()
})

it("could be set and get", () => {
  const map = new ArrayMultiMap(1)
  expect(map.has(["4"])).toBeFalsy()
  map.set(["4"], "233")
  map.set(["6"], "999")
  map.set([8], "888")
  expect(map.has(["4"])).toBeTruthy()

  expect(map.has(["5"])).toBeFalsy()
  expect(map.has(["6"])).toBeTruthy()
  expect(map.has([8])).toBeTruthy()
  expect(map.get(["4"])).toBe("233")
  expect(map.get(["6"])).toBe("999")
  expect(map.get(["8"])).toBe(undefined)
  expect(map.get([8])).toBe("888")
  expect(map.get(["4"], "666")).toBe("233")
  expect(map.get(["5"])).toBe(undefined)
  expect(map.get(["5"], "666")).toBe("666")
  expect(map.get(["6"], "666")).toBe("999")


  map.set(["4"], "666")
  expect(map.get(["4"])).toBe("666")
})

it("could be set and get multi", () => {
  const map = new ArrayMultiMap(3)
  expect(map.has(["4", "5", "6"])).toBeFalsy()
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")
  expect(map.has(["4", "5", "6"])).toBeTruthy()
  expect(map.has(["4", "5", "8"])).toBeTruthy()
  expect(map.has(["4", "6", "6"])).toBeTruthy()
  expect(map.has(["5", "5", "6"])).toBeTruthy()
  expect(map.get(["4", "5", "6"])).toBe("233")
  expect(map.get(["4", "5", "8"])).toBe("2333")
  expect(map.get(["4", "6", "6"])).toBe("23333")
  expect(map.get(["5", "5", "6"])).toBe("233333")
  expect(map.get(["1", "1", "1"], "")).toBe("")
  expect(map.get(["4", "5", "7"], "")).toBe("")
  expect(map.get(["4", "4", "6"], "")).toBe("")
  expect(map.get(["3", "5", "6"], "")).toBe("")
  expect(map.has(["1", "1", "1"])).toBeFalsy()
  expect(map.has(["4", "5", "7"])).toBeFalsy()
  expect(map.has(["4", "4", "6"])).toBeFalsy()
  expect(map.has(["3", "5", "6"])).toBeFalsy()
})

it("should throw if lens doesn't match", () => {
  const map = new ArrayMultiMap(1)
  expect(() => map.set([], "")).toThrow()
  expect(() => map.set(["4", "5"], "")).toThrow()
  expect(() => map.get(["4", "5"])).toThrow()
  expect(() => map.has([])).toThrow()
  expect(() => map.has(["4", "5"])).toThrow()
  expect(() => map.delete([])).toThrow()
  expect(() => map.delete(["4", "5"])).toThrow()
})

it("could delete and clear", () => {
  const map = new ArrayMultiMap(3)
  expect(map.size).toBe(0)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  expect(map.size).toBe(4)
  expect(map.get(["4", "5", "6"])).toBe("233")
  expect(map.has(["4", "5", "6"])).toBeTruthy()

  expect(map.delete(["4", "5", "9"])).toBeFalsy()
  expect(map.delete(["4", "5", "6"])).toBeTruthy()
  expect(map.delete(["4", "5", "9"])).toBeFalsy()
  
  expect(map.size).toBe(3)
  expect(map.has(["4", "5", "6"])).toBeFalsy()
  expect(map.get(["4", "5", "6"])).toBe(undefined)

  expect(map.has(["4", "5", "8"])).toBeTruthy()
  expect(map.has(["4", "6", "6"])).toBeTruthy()
  expect(map.has(["5", "5", "6"])).toBeTruthy()

  map.clear()
  expect(map.size).toBe(0)

  expect(map.has(["4", "5", "8"])).toBeFalsy()
  expect(map.has(["4", "6", "6"])).toBeFalsy()
  expect(map.has(["5", "5", "6"])).toBeFalsy()
})

it("could be foreach", () => {
  const map = new ArrayMultiMap(3)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  map.forEach((v, k) => {
    expect(v).toMatchSnapshot()
    expect(k).toMatchSnapshot()
  })
})

it("could be iterable", () => {
  const map = new ArrayMultiMap(3)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  for (const result of map) {
    expect(result).toMatchSnapshot()
  }
})

it("entries could be for iterable", () => {
  const map = new ArrayMultiMap(3)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  expect(map.entries()).toMatchSnapshot()

  for (const result of map.entries()) {
    expect(result).toMatchSnapshot()
  }
})

it("keys could be for iterable", () => {
  const map = new ArrayMultiMap(3)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  expect(map.keys()).toMatchSnapshot()

  for (const result of map.keys()) {
    expect(result).toMatchSnapshot()
  }
})

it("values could be for iterable", () => {
  const map = new ArrayMultiMap(3)
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  expect(map.values()).toMatchSnapshot()

  for (const result of map.values()) {
    expect(result).toMatchSnapshot()
  }
})


