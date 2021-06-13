import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  InternalAdminLogger,
  InternalAdminLoggerRecord,
  InternalLoggerMeta,
} from "@webcarrot/multi-lan-controller/admin/api/logger/types";
import {
  ItemContent,
  Loader,
  useAdminApiCall,
} from "@webcarrot/multi-lan-controller/admin/components";
import * as React from "react";
import { CSVLine, makeCsvLine } from "./csv";
import { Footer } from "./footer";

const formatToCsv = (items: ReadonlyArray<InternalAdminLoggerRecord>) =>
  [["date", "user", "component", "name"] as CSVLine]
    .concat(
      items.map<CSVLine>(({ date, user, component, name }) => [
        new Date(date).toISOString(),
        user,
        component,
        name,
      ])
    )
    .map(makeCsvLine)
    .join("\r\n");

export const Admin = React.memo(() => {
  const [data, setData] = React.useState<InternalAdminLogger>(null);
  const [query, setQuery] = React.useState<InternalLoggerMeta>({
    limit: 50,
    offset: 0,
    total: null,
  });

  const adminApi = useAdminApiCall();

  const handleExport = React.useCallback(
    (query: InternalLoggerMeta) =>
      adminApi("Logger/List", {
        type: "admin",
        limit: 100000000,
        offset: 0,
        fromDate: query.fromDate,
        toDate: query.toDate,
      }).then(({ items }: InternalAdminLogger) => formatToCsv(items)),
    [adminApi]
  );

  React.useEffect(() => {
    let handleData = setData;
    adminApi("Logger/List", {
      type: "admin",
      limit: query.limit,
      offset: query.offset,
      fromDate: query.fromDate,
      toDate: query.toDate,
    }).then((data: InternalAdminLogger) => handleData(data));
    return () => {
      handleData = () => {};
    };
  }, [query, adminApi]);

  return data ? (
    <>
      <ItemContent>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map(({ date, user, component, name }, key) => (
                <TableRow key={`${key}-${date}`}>
                  <TableCell align="left">
                    {new Date(date).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{user}</TableCell>
                  <TableCell align="left">{component}</TableCell>
                  <TableCell align="left">{name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ItemContent>
      <Footer meta={data.meta} onChange={setQuery} onExport={handleExport} />
    </>
  ) : (
    <Loader />
  );
});
