import {get, uniq} from 'lodash';

const toSpliced = (arr: string[], startIndex: number, deleteCount: number, ...items: string[]) => {
  // Just doing a copy to avoid mutating an array when spicing
  const copy = [...arr];
  copy.splice(startIndex, deleteCount, ...items);
  return copy;
};

export function recursivelyAppendToSchema(
  fullRef: string,
  elementSchema: any,
  required: boolean,
  refIndex: number,
  constructedSchema: any,
): { properties: any; required: any } {
  const splitRef = fullRef.split("/");
  const refKey = splitRef[refIndex];
  if (refIndex === splitRef.length - 1) {
    const constructedPropertyKeyUpToIndex = splitRef.slice(0, refIndex).join('.'); // get's the keys for the property
    const constructedRequiredKeyUpToIndex = toSpliced(splitRef.slice(0, refIndex), refIndex - 1, 1, 'required').join('.');
    return {
      properties: { ...get(constructedSchema, constructedPropertyKeyUpToIndex, {}), [refKey]: elementSchema },
      required: get(constructedSchema, constructedRequiredKeyUpToIndex, []).concat(required ? refKey : []),
    };
  }
  if (refKey === "properties") {
    return recursivelyAppendToSchema(
      fullRef,
      elementSchema,
      required,
      refIndex + 1,
      constructedSchema,
    );
  } else {
    const constructedPropertyKeyUpToIndex = splitRef.slice(0, refIndex).join('.'); // get's the keys for the property
    const constructedRequiredKeyUpToIndex = toSpliced(splitRef.slice(0, refIndex), refIndex - 1, 1, 'required').join('.'); // get's the keys for the required
    return {
      properties: {
        ...get(constructedSchema, constructedPropertyKeyUpToIndex, {}),
        [refKey]: recursivelyAppendToSchema(
          fullRef,
          elementSchema,
          required,
          refIndex + 1,
          constructedSchema,
        ),
      },
      required: uniq(get(constructedSchema, constructedRequiredKeyUpToIndex, []).concat(required ? refKey : [])),
    };
  }
}

export function getPropertyFromRef(str: string) {
  // Split the string by '/'
  const parts = str.split("/");

  // Filter out empty strings and the '#' prefix
  const filteredParts = parts.filter(part => part !== "" && part !== "#");

  // Map each part to the appropriate property name
  const transformedParts = filteredParts.map((part, index) => {
    // For the first part, remove the 'properties' prefix
    if (index === 0 && part === "properties") {
      return "";
    }
    // For subsequent parts, convert 'properties' to '.'
    else if (part === "properties") {
      return ".";
    }
    // Otherwise, return the part as is
    else {
      return part;
    }
  });

  // Join the transformed parts with '.'
  return transformedParts.join("");
}
