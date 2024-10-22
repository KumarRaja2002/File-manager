import { Category, CategoryTable, NewCategory } from "../schemas/category";
import { NewUser, User, UserTable } from "../schemas/user";
import { File, FileTable, NewFile } from "../schemas/file";


export type DBRecord = User | Category | File
export type NewDBRecord = NewUser | NewCategory | NewFile 
export type DBTable = UserTable  | CategoryTable | FileTable
