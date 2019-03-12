import { Color } from '../utils/Color';
import { Point } from '../utils/Point';
import { Size } from '../utils/Size';
import { Screen } from './Screen';

export class Sprite {
  public textureName: string;
  public pos: Point;
  public size: Size;
  public heading: number;
  public color: Color;
  public visible: boolean;
  private textureDict: string;

  constructor(textureDict, textureName, pos, size, heading = 0, color = new Color(255, 255, 255, 255)) {
    this.textureDict = textureDict;
    this.textureName = textureName;
    this.pos = pos;
    this.size = size;
    this.heading = heading;
    this.color = color;
    this.visible = true;
  }

  public LoadTextureDictionary(): Promise<void> {
    return new Promise(resolve => {
      RequestStreamedTextureDict(this.textureDict, true);
      console.log('gonna load');
      const interval = setInterval(() => {
        if (this.IsTextureDictionaryLoaded) {
          console.log('yuppp loaded');
          resolve();
          clearInterval(interval);
        } else {
          console.log('nooope');
        }
      }, 0);
    });
  }

  public set TextureDict(v) {
    this.textureDict = v;
    if (!this.IsTextureDictionaryLoaded) {
      this.LoadTextureDictionary();
    }
  }
  public get TextureDict(): string {
    return this.textureDict;
  }

  public get IsTextureDictionaryLoaded(): number {
    return HasStreamedTextureDictLoaded(this.textureDict);
  }

  public async Draw(textureDictionary?, textureName?, pos?, size?, heading?, color?, loadTexture?): Promise<void> {
    textureDictionary = textureDictionary || this.TextureDict;
    textureName = textureName || this.textureName;
    pos = pos || this.pos;
    size = size || this.size;
    heading = heading || this.heading;
    color = color || this.color;
    loadTexture = loadTexture || true;

    if (loadTexture) {
      if (!HasStreamedTextureDictLoaded(textureDictionary)) {
        RequestStreamedTextureDict(textureDictionary, true);
      }
    }
    const height = 1080.0;
    const ratio = Screen.AspectRatio;
    const width = height * ratio;

    const w = this.size.Width / width;
    const h = this.size.Height / height;
    const x = this.pos.X / width + w * 0.5;
    const y = this.pos.Y / height + h * 0.5;

    DrawSprite(textureDictionary, textureName, x, y, w, h, heading, color.R, color.G, color.B, color.A);
  }
}
