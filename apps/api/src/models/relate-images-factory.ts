import file from "./File";
import fileRelatedMorph from "./FileRelatedMorph";

export default (
  File: ReturnType<typeof file>,
  FileRelatedMorph: ReturnType<typeof fileRelatedMorph>
) => {
  return ({
    Model,
    relatedType,
    as,
    field
  }: {
    Model: any;
    relatedType: string;
    as: string;
    field: string;
  }) => {
    File.belongsToMany(Model, {
      through: {
        model: FileRelatedMorph,
        unique: false,
        scope: {
          relatedType,
          field
        }
      },
      foreignKey: "fileId",
      otherKey: "related_id",
      as
    });

    Model.belongsToMany(File, {
      through: {
        model: FileRelatedMorph,
        unique: false,
        scope: { relatedType, field }
      },
      foreignKey: "relatedId",
      otherKey: "file_id",
      constraints: false,
      as: field
    });
  };
};
