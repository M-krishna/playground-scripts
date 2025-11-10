module Full_subtractor(
    input a, b, Bin,
    output D, Bout
);
    wire diff, borrow1;
    Half_subtractor hs1(a, b, diff, borrow1);

    wire borrow2;
    Half_subtractor hs2(diff, Bin, D, borrow2);

    _Or o(borrow1, borrow2, Bout);
endmodule