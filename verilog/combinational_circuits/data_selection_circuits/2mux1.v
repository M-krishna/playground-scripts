module mux21(
    input a, b, sel,
    output Y
);
    wire not_sel;
    _Not n(sel, not_sel);

    wire not_sel_and_i0;
    _And(not_sel, I0, not_sel_and_i0);
endmodule