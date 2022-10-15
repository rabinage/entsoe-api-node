declare module "rectangle" {
  export interface Rectangle {
    area: number;
    help(): void;
  }

  export default function (height: number, width: number): Rectangle;
}
