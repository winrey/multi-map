
import { ArrayMultiMap } from '../src/arrayMap';

it("could be created", () => {
  new ArrayMultiMap()
  new ArrayMultiMap()
})

it("could be set and get", () => {
  const map = new ArrayMultiMap()
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
  const map = new ArrayMultiMap()
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
  expect(map.has(["1", "1", "1"])).toBeTruthy()
  expect(map.has(["4", "5", "7"])).toBeTruthy()
  expect(map.has(["4", "4", "6"])).toBeTruthy()
  expect(map.has(["3", "5", "6"])).toBeTruthy()
})

it("should accept unfixed length array", () => {
  const map = new ArrayMultiMap()
  expect(() => map.set([], "1")).not.toThrow()
  expect(() => map.set(["4"], "1234")).not.toThrow()
  expect(() => map.set(["4", "5"], "12")).not.toThrow()
  expect(() => map.set(["4", "5", "6"], "123")).not.toThrow()
  expect(map.get([])).toBe("1")
  expect(map.get(["4"])).toBe("1234")
  expect(map.get(["4", "5"])).toBe("12")
  expect(map.get(["4", "5", "6"])).toBe("123")
  expect(() => map.delete([])).not.toThrow()
  expect(() => map.delete(["4", "5"])).not.toThrow()
  expect(map.get([], "233")).toBe("233")
  expect(map.get(["4"])).toBe("1234")
  expect(map.get(["4", "5", "6"])).toBe("123")
})

it("could delete and clear", () => {
  const map = new ArrayMultiMap()
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
  expect(map.delete(["4", "6", "6"])).toBeTruthy()
  expect(map.delete(["4", "5", "9"])).toBeFalsy()
  
  expect(map.size).toBe(2)
  expect(map.has(["4", "5", "6"])).toBeFalsy()
  expect(map.has(["4", "6", "6"])).toBeFalsy()
  expect(map.get(["4", "5", "6"])).toBe(undefined)
  expect(map.get(["4", "6", "6"])).toBe(undefined)

  expect(map.has(["4", "5", "8"])).toBeTruthy()
  expect(map.has(["5", "5", "6"])).toBeTruthy()

  map.clear()
  expect(map.size).toBe(0)

  expect(map.has(["4", "5", "8"])).toBeFalsy()
  expect(map.has(["4", "6", "6"])).toBeFalsy()
  expect(map.has(["5", "5", "6"])).toBeFalsy()
})

it("could clone", () => {
  const map = new ArrayMultiMap()
  map.set([4, 5, 6], "233")
  map.set([4, 5, 8], "2333")
  map.set([4, 6, 6], "23333")
  const clone = map.clone()
  map.set([4, 5, 8], "6666")
  clone.set([4, 5, 10], "999")

  clone.forEach((v, k) => {
    expect(v).toMatchSnapshot()
    expect(k).toMatchSnapshot()
  })
})


it("could be foreach", () => {
  const map = new ArrayMultiMap()
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
  const map = new ArrayMultiMap()
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  for (const result of map) {
    expect(result).toMatchSnapshot()
  }
})

it("entries could be for iterable", () => {
  const map = new ArrayMultiMap()
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
  const map = new ArrayMultiMap()
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
  const map = new ArrayMultiMap()
  map.set(["4", "5", "6"], "233")
  map.set(["4", "5", "8"], "2333")
  map.set(["4", "6", "6"], "23333")
  map.set(["5", "5", "6"], "233333")

  expect(map.values()).toMatchSnapshot()

  for (const result of map.values()) {
    expect(result).toMatchSnapshot()
  }
})

it("could have default function", () => {
  const map = new ArrayMultiMap(() => "111")
  expect(map.get(["4", "5", "6"])).toBe("111")
  expect(map.get(["4", "5", "7"], "222")).toBe("222")
  map.set(["4", "5", "8"], "333")
  expect(map.get(["4", "5", "8"], "444")).toBe("333")
  expect(map.get(["4", "5", "6"])).toBe("111")
  expect(map.get(["4", "5", "7"])).toBe("222")
  expect(map.get(["4", "5", "8"])).toBe("333")
  map.delete(["4", "5", "8"])
  expect(map.get(["4", "5", "8"])).toBe("111")
})

test("meta", () => {
  const arr = new ArrayMultiMap()
  expect(String(arr)).toBe("[object ArrayMultiMap]")
})

