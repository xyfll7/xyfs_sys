Object.prototype.lgg = function <T>(str: string): T {
  console.info(`::: ${str ?? ""}`, this);
  return this as T;
};
Object.defineProperty(Object.prototype, 'lgg', { "enumerable": false });
