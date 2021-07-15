export interface IWorld {
    cache: IWorldCache;
    reset(): void;
    deleteCache(key: string): void;
}

export interface IWorldCache {
    [key: string]: any;
}

export interface ICachedValues {
    [key: string]: string;
}

export class WorldClass implements IWorld {

    private _cache: IWorldCache = {};

    constructor() {
        this.reset();
    }

    public reset(): void {
        this._cache = {};
    }

    public set cache(value: IWorldCache) {
        this._cache = Object.assign(this.cache, value);
    }

    public get cache(): IWorldCache {
        return this._cache;
    }

    public deleteCache(key: string): void {
        delete this._cache[key];
    }
}

const World = new WorldClass();

export { World };
