
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}
export function cssVar(win:any,elem:any,name:string,value?:string){
  if(name[0]!='-') name = '--'+name //allow passing with or without --
  if(value) elem.style.setProperty(name, value)
  return win.getComputedStyle(elem).getPropertyValue(name);
}
