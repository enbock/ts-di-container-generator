import AdditionalResourcesExtractor from './AdditionalResourcesExtractor';
import {Spy} from 'jasmine-auto-spies';
import mock from 'Core/mock';
import FileExtractor from 'Core/Generator/Interactor/Task/FileExtractor';
import DescriptorEntity, {AliasEntity, ClassEntity, ImportEntity} from 'Core/DescriptorEntity';
import MockedObject from 'Core/MockedObject';

describe('AdditionalResourcesExtractor', function (): void {
    let extractor: AdditionalResourcesExtractor,
        fileExtractor: Spy<FileExtractor>;

    beforeEach(function (): void {
        fileExtractor = mock<FileExtractor>();

        extractor = new AdditionalResourcesExtractor(
            fileExtractor
        );
    });

    it('should extract additional descriptors', function (): void {
        const additionalDescriptor: DescriptorEntity = new DescriptorEntity('');
        const importEntity: ImportEntity = new ImportEntity(
            'test::importPathFromContainer',
            new AliasEntity('AliasFromContainer', '', true)
        );
        additionalDescriptor.imports = [importEntity];

        const importHolderDescriptor: DescriptorEntity = new DescriptorEntity('Import-Holder');
        const extractedDescriptor: DescriptorEntity = new DescriptorEntity('test::realImportPath');
        const classEntity: ClassEntity = new ClassEntity('TheRealImportClass');
        classEntity.isDefault = true;
        extractedDescriptor.provides = [classEntity];

        fileExtractor.extract.and.returnValue(extractedDescriptor);

        extractor.extract(
            [additionalDescriptor],
            {} as MockedObject,
            importHolderDescriptor
        );

        expect(fileExtractor.extract).toHaveBeenCalledWith(importEntity.file, {} as MockedObject);
        expect(importHolderDescriptor.imports.length).toBe(1);
        expect(importHolderDescriptor.imports[0].file).toBe(extractedDescriptor.file);
        expect(importHolderDescriptor.imports[0].alias.name).toBe(classEntity.name);
    });
});