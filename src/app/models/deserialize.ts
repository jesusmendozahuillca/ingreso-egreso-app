
export function jsonDeserialize<T>(object: T ): T {
  if ( typeof object === null ) { return; }
  return  JSON.parse(JSON.stringify(object));
}

