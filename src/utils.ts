import { uniq, get } from 'lodash';

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
) {
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
