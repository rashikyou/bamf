type TFN = {(evt: SrcResult[]): void}
interface FileUnit {
  filename: string;
  fileData: Uint8Array;
}

interface SrcResult {
  0: number;// idex
  1: string;// filename
  2: string;// filedata
}

export default class Loader {
  reader: FileReader;

  constructor () {
    this.reader = new FileReader();
  }

  _compareFileNames (a: string, b: string) {
    const ax: ((string|number)[])[] = [];
    const bx: ((string|number)[])[] = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2): string {
      const arr: (string|number)[] = [$1 || Infinity, $2 || ""];
      ax.push(arr);
      return '';
    });

    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2): string {
      const arr: (string|number)[] = [$1 || Infinity, $2 || ""];
      bx.push(arr);
      return '';
    });

    while (ax.length && bx.length) {
      const an: (number|string)[] = ax.shift() ?? [];
      const bn: (number|string)[] = bx.shift() ?? [];
      // const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
      // if (nn) return nn;
      if (typeof an[0] === 'number' && typeof bn[0] === 'number') {
        const nn = an[0] - bn[0];
        return nn;
      }

      if (typeof an[1] === 'string' && typeof bn[1] === 'string') {
        const nn = an[1].localeCompare(bn[1]);
        return nn;
      }
    }
    const len = ax.length + bx.length;
    return len;
  }

  _zip (file: File, fn: TFN) {
    // const that = this;
    import(/* webpackChunkName: "jszip" */ "jszip").then((JSZip) => {
      JSZip.loadAsync(file)
        .then((zip) => {
          const re = /^(?:(?!__macosx)).*(.jpg|.png|.gif|.jpeg)$/;
          const promises = Object.keys(zip.files)
            // .sort(that._compareFileNames)
            .sort(this._compareFileNames)
            .filter(function (fileName) {
              // don't consider non image files
              return re.test(fileName.toLowerCase());
            })
            .map(function (fileName, index) {
              const file = zip.files[fileName];
              return file.async("blob").then(function (blob): SrcResult {
                return [
                  index,
                  fileName, // keep the link between the file name and the content
                  URL.createObjectURL(blob) // create an url. img.src = URL.createObjectURL(...) will work
                ];
              });
            });
          // `promises` is an array of promises, `Promise.all` transforms it
          // into a promise of arrays
          return Promise.all(promises);
        })
        .then((result: SrcResult[]) => {
          return fn(result);
        });
    });
  }

  _rar (rarFile: (string|ArrayBuffer|undefined|null), fn: TFN) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    import(/* webpackChunkName: "unrar" */ "unrar-js/lib/Unrar" as any).then((unrar) => {
      try {
        const files: FileUnit[] = unrar.default(rarFile);
        const result: SrcResult[] = files.map((file, index: number) => {
          return [
            index,
            file.filename,
            URL.createObjectURL(new Blob([file.fileData], { type: "image/jpg" }))
          ];
        });

        return fn(result);
      } catch (e) {
        console.log(e.message);
        return null;
      }
    });
  }

  read (file: File, fn: TFN) {
    // let that = this;
    if (typeof FileReader !== "undefined") {
      /*
      this.reader.onload = (evt: any) => {
        return fn(evt);
      };
      */
      if (file.name.endsWith(".cbz") || file.name.endsWith(".zip")) {
        // return that._zip(file, fn);
        return this._zip(file, fn);
      } else if (file.name.endsWith(".cbr") || file.name.endsWith(".rar")) {
        // that.reader.onload = evt => {
        this.reader.onload = (evt) => {
          // return that._rar(evt.target.result, fn);
          return this._rar(evt?.target?.result, fn);
        };
        // that.reader.readAsArrayBuffer(file);
        this.reader.readAsArrayBuffer(file);
      } else if (file.type.includes("image")) {
        // that.reader.readAsDataURL(file);
        this.reader.readAsDataURL(file);
      }
    }
  }
}
