module not_tb;
    reg a;
    wire out;

    _Not n(
        .a(a),
        .out(out)
    );

    initial begin
        #0 a = 0;

        #5 a = 1;
        #1 a = 0;
        #1 $finish;
    end

    initial begin
        $monitor("[$Time=%0t] a=%0b out=%0b", $time, a, out);
    end
endmodule