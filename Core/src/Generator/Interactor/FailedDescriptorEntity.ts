import FileName from 'Core/File/FileName';

export default class FailedDescriptorEntity {
    constructor(
        public basePath: string = '',
        public file: FileName = '',
        public modulePath: FileName = ''
    ) {
    }
}