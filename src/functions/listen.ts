type TF = {(e: KeyboardEvent): void};
// eslint-disable-next-line
type TWIN = any;/* window */
export const listen = (el: TWIN, ev: string, f: TF) => {
  if (el.attachEvent) {
    return el.attachEvent("on" + ev, f);
  } else {
    return el.addEventListener(ev, f, false);
  }
};
