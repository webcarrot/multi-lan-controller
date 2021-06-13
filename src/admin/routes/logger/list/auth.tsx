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
  InternalAuthLogger,
  InternalAuthLoggerRecord,
  InternalLoggerMeta,
} from "@webcarrot/multi-lan-controller/admin/api/logger/types";
import {
  ItemContent,
  Loader,
  useAdminApiCall,
} from "@webcarrot/multi-lan-controller/admin/components";
import * as React from "react";
import {
  CSVLine,
  makeCsvLine,
} from "@webcarrot/multi-lan-controller/common/utils/csv";
import { Footer } from "./footer";

const formatToCsv = (items: ReadonlyArray<InternalAuthLoggerRecord>) =>
  [["date", "user", "action"] as CSVLine]
    .concat(
      items.map<CSVLine>(({ date, user, logIn }) => [
        new Date(date).toISOString(),
        user,
        logIn ? "login" : "logout",
      ])
    )
    .map(makeCsvLine)
    .join("\r\n");

export const Auth = React.memo(() => {
  const [data, setData] = React.useState<InternalAuthLogger>(null);
  const [query, setQuery] = React.useState<InternalLoggerMeta>({
    limit: 50,
    offset: 0,
    total: null,
  });

  const adminApi = useAdminApiCall();

  const handleExport = React.useCallback(
    (query: InternalLoggerMeta) =>
      adminApi("Logger/List", {
        type: "auth",
        limit: 100000000,
        offset: 0,
        fromDate: query.fromDate,
        toDate: query.toDate,
      }).then(({ items }: InternalAuthLogger) => formatToCsv(items)),
    [adminApi]
  );

  React.useEffect(() => {
    let handleData = setData;
    adminApi("Logger/List", {
      type: "auth",
      limit: query.limit,
      offset: query.offset,
      fromDate: query.fromDate,
      toDate: query.toDate,
    }).then((data: InternalAuthLogger) => handleData(data));
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map(({ date, user, logIn }, key) => (
                <TableRow key={`${key}-${date}`}>
                  <TableCell align="left">
                    {new Date(date).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{user}</TableCell>
                  <TableCell align="left">
                    {logIn ? "login" : "logout"}
                  </TableCell>
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
