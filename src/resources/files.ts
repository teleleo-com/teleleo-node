// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import { APIResource } from '../resource.js';
import type { TmpFile } from '../types/models.js';
import type { FilesGenerateSpeechParams, FilesUploadTmpParams } from '../types/params.js';
import { pathParam } from '../utils.js';
/** Downloads, temporary audio uploads and text-to-speech. */
export class FilesResource extends APIResource {
  /**
   * Get file.
   *
   * Downloads a file of the account: a call recording, the audio of a call scenario or a mailing, an invoice document. The file_id comes from those objects (file_id, call_scenario_file_id, invoice and receipt files).
   *
   * @param fileId -
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, FILE_NOT_FOUND_EXCEPTION.
   */
  download(fileId: number, options?: RequestOptions): Promise<Uint8Array> {
    return this._client.requestBytes('GET', `/file/${pathParam(fileId)}`, { options });
  }

  /**
   * Get temporary file.
   *
   * Served only to the user who uploaded the file. A missing file and somebody else's upload both answer 404 TMP_FILE_NOT_FOUND.
   *
   * @param fileId - tmp_file_id as returned by POST /file/upload-tmp or POST /file/generate-speech: `<2 hex>/<32 hex>/<file name>`. Put it into the path as is: the slashes are path separators and must not be percent-encoded (most SDK generators encode `/` in a path parameter by default; turn it off for this one). Percent-encode only characters of the file name that are not allowed in a path segment.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, TMP_FILE_NOT_FOUND.
   */
  downloadTmp(fileId: string, options?: RequestOptions): Promise<Uint8Array> {
    return this._client.requestBytes('GET', `/file/tmp/${pathParam(fileId, true)}`, { options });
  }

  /**
   * Upload temporary file.
   *
   * Uploads an audio file as a temporary file, converted to the modem format; pass the returned tmp_file_id to a call scenario or a call mailing.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, FILE_ERROR_IDENTIFIER_EMPTY_FIELDS, FILE_ERROR_FILE_NOT_VALID_BASE_64, FILE_ERROR_FILE_WRONG_TYPE, FILE_ERROR_FILE_NOT_VALID_SIZE, FILE_ERROR_CONVERT_TO_DONGLE_AUDIO, FILE_ERROR_DONGLE_AUDIO_TOO_LARGE.
   */
  uploadTmp(params: FilesUploadTmpParams, options?: RequestOptions): Promise<TmpFile> {
    return this._client
      .request('POST', '/file/upload-tmp', {
        body: {
          file_base64: params.file_base64,
          file_name: params.file_name,
          scenario: params.scenario ?? 'SCENARIO_CONVERT_TO_DONGLE_AUDIO_AND_UPLOAD_TMP',
        },
        options,
      })
      .then((data) => data as TmpFile);
  }

  /**
   * Generate speech.
   *
   * Synthesises the text into a temporary audio file for a call scenario or a call mailing; pass the returned tmp_file_id as the audio of those. Limited to 5 calls per day per user: the 6th answers 429 RATE_LIMIT_EXCEEDED.
   *
   * Error codes (`errorMessage`): RATE_LIMIT_EXCEEDED, FILE_GENERATE_SPEECH_IDENTIFIER_EMPTY_FIELDS, FILE_GENERATE_SPEECH_IDENTIFIER_NOT_ALLOWED_VOICE, FILE_GENERATE_SPEECH_IDENTIFIER_NOT_ALLOWED_LANGUAGE, FILE_GENERATE_SPEECH_IDENTIFIER_LONG_TEXT.
   */
  generateSpeech(params: FilesGenerateSpeechParams, options?: RequestOptions): Promise<TmpFile> {
    return this._client
      .request('POST', '/file/generate-speech', {
        body: { text: params.text, voice: params.voice, language: params.language },
        options,
      })
      .then((data) => data as TmpFile);
  }
}
