export interface FieldMapper {
    type : string;
    name : string;
    fields? : FieldMapper[]
}