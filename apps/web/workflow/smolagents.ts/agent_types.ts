// TypeScript translation of the Python code

import * as path from "path";
import * as uuid from "uuid";
import * as tmp from "tmp";
import { display } from "node-kernel"; // For Jupyter notebook display
import sharp from 'sharp'; // Image processing library for Node.js

// Logger utility (equivalent to `logging` in Python)
const logger = console;

// AgentType base class
abstract class AgentType<T> {
    protected _value: T;

    constructor(value: T) {
        this._value = value;
    }

    toString(): string {
        return this.to_string();
    }

    to_raw(): T {
        logger.error(
            "This is a raw AgentType of unknown type. Display in notebooks and string conversion will be unreliable"
        );
        return this._value;
    }

    to_string(): string {
        logger.error(
            "This is a raw AgentType of unknown type. Display in notebooks and string conversion will be unreliable"
        );
        return String(this._value);
    }
}

// AgentText class
class AgentText extends AgentType<string> {
    to_raw(): string {
        return this._value;
    }

    to_string(): string {
        return this._value;
    }
}

// AgentImage class
class AgentImage extends AgentType<any> {
    private _path: string | null = null;
    private _raw: sharp.Sharp | null = null;
    private _tensor: any | null = null;

    constructor(value: any) {
        super(value);

        if (value instanceof AgentImage) {
            this._raw = value._raw;
            this._path = value._path;
            this._tensor = value._tensor;
        } else if (typeof value === 'function' && value.constructor.name === 'Sharp') {
            this._raw = value;
        } else if (typeof value === "string") {
            this._path = value;
        } else {
            throw new TypeError(`Unsupported type for AgentImage: ${typeof value}`);
        }
    }

    _ipython_display_(): void {
        display.text(this.to_string());
    }

    to_raw(): sharp.Sharp {
        if (this._raw) {
            return this._raw;
        }

        if (this._path) {
            // Load the image from the path
            this._raw = sharp(this._path);
            return this._raw;
        }

        if (this._tensor) {
            // Convert tensor to image (placeholder logic)
            const array = this._tensor;
            this._raw = sharp(array);
            return this._raw;
        }

        throw new Error("Unable to convert to raw image format.");
    }

    to_string(): string {
        if (this._path) {
            return this._path;
        }

        if (this._raw) {
            const directory = tmp.dirSync().name;
            this._path = path.join(directory, `${uuid.v4()}.png`);
            this.to_raw().toFile(this._path); // Save the image
            return this._path;
        }

        throw new Error("Unable to convert to string format.");
    }

    save(outputPath: string, format?: string, params?: any): void {
        const img = this.to_raw();
        img.toFile(outputPath, { format, ...params }); // Save the image
    }
}

// AgentAudio class
class AgentAudio extends AgentType<any> {
    private _path: string | null = null;
    private _tensor: any | null = null;
    private samplerate: number;

    constructor(value: any, samplerate: number = 16000) {
        super(value);

        this.samplerate = samplerate;

        if (typeof value === "string") {
            this._path = value;
        } else {
            throw new TypeError(`Unsupported type for AgentAudio: ${typeof value}`);
        }
    }

    _ipython_display_(): void {
        display.text(this.to_string());
    }

    to_raw(): any {
        if (this._tensor) {
            return this._tensor;
        }

        if (this._path) {
            // TODO: Implement audio loading
            // const audioData = wav.read(this._path);
            // this._tensor = audioData.channelData;
            // this.samplerate = audioData.sampleRate;
            throw new Error("Audio loading not yet implemented");
        }

        throw new Error("Unable to convert to raw audio format.");
    }

    to_string(): string {
        if (this._path) {
            return this._path;
        }

        if (this._tensor) {
            const directory = tmp.dirSync().name;
            this._path = path.join(directory, `${uuid.v4()}.wav`);
            // TODO: Implement audio saving
            throw new Error("Audio saving not yet implemented");
            return this._path as string;
        }

        throw new Error("Unable to convert to string format.");
    }
}

// Agent type mapping
const AGENT_TYPE_MAPPING: { [key: string]: any } = {
    string: AgentText,
    image: AgentImage,
    audio: AgentAudio,
};

// Helper functions
export function handle_agent_input_types(...args: any[]): any[] {
    return args.map((arg) => (arg instanceof AgentType ? arg.to_raw() : arg));
}

export function handle_agent_output_types(output: any, output_type?: string): any {
    if (output_type && AGENT_TYPE_MAPPING[output_type]) {
        return new AGENT_TYPE_MAPPING[output_type](output);
    }

    if (typeof output === "string") {
        return new AgentText(output);
    }

    if (typeof output === 'function' && output.constructor.name === 'Sharp') {
        return new AgentImage(output);
    }

    return output;
}

export { AgentType, AgentText, AgentImage, AgentAudio };