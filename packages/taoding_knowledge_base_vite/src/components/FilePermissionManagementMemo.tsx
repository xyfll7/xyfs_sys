import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useEffect, useState } from "react";
import { auth_users } from "../api";
import { MyFile, User } from "../vite-env";
import { Button } from "./ui/button";


function FilePermissionManagement({ file, onSetUsers, onComplete }: { file: MyFile, onComplete: () => void, onSetUsers?: (e: User[]) => void; }) {
  const [users, setUsers] = useState<User[]>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  useEffect(() => {
    (async () => {
      const res = await auth_users({ fid: file.fid });
      if (res) {
        setUsers(res.users);
        setSelectedUsers(res.users.filter(e => e.rule != null));
        onSetUsers?.(res.users.filter(e => e.rule != null));
        onComplete();
      }
    })();
  }, [file.fid, onComplete]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "用户名",
    },
    {
      id: "actions",
      enableHiding: false,
      header: "权限",
      cell: ({ row }) => {
        const user = row.original;
        return <RulesManager user={user} selectedUsers={selectedUsers} onSelectedRule={(e) => {

          let users: User[] = [];
          if (!e) {
            users = selectedUsers.filter((e) => e.user_id != user.user_id);
          } else {
            const user_ = JSON.parse(JSON.stringify(user));
            user_.rule = e;
            users = [...selectedUsers, user_];
          }
          setSelectedUsers(users);
          onSetUsers?.(users);
        }}></RulesManager>;
      },
    },
  ];



  return <div className="flex flex-col overflow-hidden  items-start w-full">
    {!users && <Button variant={"outline"} className="border-0 shadow-none text-gray-500">数据加载中...</Button>}
    {users && <>
      <DataTable data={users} columns={columns}></DataTable>
    </>}
  </div>;
}
export const FilePermissionManagementMemo = memo(FilePermissionManagement, () => { return true; });




function RulesManager({ user, selectedUsers, onSelectedRule }: { selectedUsers: User[], user: User; onSelectedRule: (e: string | null) => void; }) {
  const user___ = selectedUsers.find(e => user.user_id == e.user_id) ?? user;
  const [rule, setRule] = useState<string | null>(user___.rule);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={user.rule == "0"}>
        <Button variant="ghost" className={`h-8 w-8 p-0 ${user.rule != rule ? "text-primary" : "text-gray-500"}`}>
          {rule !== null ? (["所有者", "下载", "编辑", "管理员"][Number(rule)]) : "暂无权限"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { setRule(null); onSelectedRule(null); }}>取消</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => { setRule("0"); onSelectedRule("0"); }}>所有者</DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => { setRule("3"); onSelectedRule("3"); }}>管理员</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setRule("2"); onSelectedRule("2"); }}>编辑</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setRule("1"); onSelectedRule("1"); }}>下载 </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
