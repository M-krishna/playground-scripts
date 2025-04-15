Compute S 1.
Compute pred 0.

Definition plusone (n: nat): nat := S n.
Compute plusone 11.

Definition minusone (n: nat): nat := pred n.
Compute minusone 22.


(*Implementing our own pred *)
Definition pred' (n: nat): nat :=
    match n with
    | O => O
    | S m => m
    end.
Compute pred' 300.

Fixpoint addtwonumbers (n1 n2: nat): nat :=
    match n1 with
    | O => n2
    | S m => addtwonumbers m (S n2)
    end.

Definition checkmatch (n: nat): nat :=
    match n with
    | O => O
    | S m => m
    end.
Compute checkmatch 100.

Fixpoint addtwonumbers' (n1 n2: nat): nat :=
    match n1, n2 with
    | O, _ => n2
    | _, O => n1
    | S m, _ => addtwonumbers' m (S n2)
    end.
Check addtwonumbers'.
Compute addtwonumbers' 100 200.


Definition minustwo (n: nat): nat :=
    match n with
    | O => O
    | S 0 => 0
    | S (S m) => m
    end.
Check minustwo.
Compute minustwo 4.

Fixpoint minustwonumbers (n1 n2: nat): nat :=
    match n1, n2 with
    | O, _ => O
    | S _, O => n1
    | S m, S n => minustwonumbers m n
    end.

Compute minustwonumbers 0 0. (* should return 0*)
Compute minustwonumbers 1 0. (* should return 0*)
Compute minustwonumbers 1 1. (* should return 0*)
Compute minustwonumbers 10 110.


Fixpoint factorial (n: nat): nat :=
    match n with
    | O => 1
    | S m => n * factorial (m)
    end.

Compute factorial 1.
(* 0 1 1 2 3 5 8 13 21...
Fixpoint fib (n: nat): nat :=
    match n with
    | O => O
    | 1 => 1
    | S (S m) => fib m + fib (S m)
    end.
Compute fib *)
(* 2 - S (S O) *)


(* Prove addition associative property *)
Theorem prove_addition_associative:
    forall a b c: nat, a + (b + c) = (a + b) + c.
    Proof.
    intros a b c.
    induction a as [| a' IHa'].
    - simpl. reflexivity.
    - simpl. rewrite IHa'. reflexivity.
    Qed.

(* Prove that a + 0 = a *)
Theorem add_0_right:
    forall a: nat, a + 0 = a.
    Proof.
    intros a.
    induction a as [| a' IHa'].
    - reflexivity.
    - simpl. rewrite IHa'. reflexivity.
    Qed.

Locate "+".
Print Nat.add.


(* Is it possible to prove this form: 
    S (b + a') = b + S a'
*)
Theorem plus_n_Sm:
    forall n m: nat, S (n + m) = n + (S m).
    Proof.
    intros n m.
    induction n as [| n' IHn'].
    - simpl. reflexivity.
    - simpl. rewrite IHn'. reflexivity.
    Qed.



(* Prove addition cummutative property *)
Theorem prove_addition_cummutative:
    forall a b: nat, a + b = b + a.
    Proof.
    intros a b.
    induction a as [| a' IHa'].
    - simpl. rewrite add_0_right. reflexivity.
    - simpl. rewrite IHa'. rewrite plus_n_Sm. reflexivity.
    Qed.

Locate "*".
Print Nat.mul.
(* Prove if you multiply 0 with any natural number
it results in 0 using Proof by induction.
0 * n = 0
*)
Theorem mult_0_left:
    forall n: nat, 0 * n = 0.
    Proof.
    intros n.
    induction n as [| n' IHn'].
    - simpl. reflexivity.
    - simpl. reflexivity.
    Qed.

(* Prove n * 0 = 0 *)
Theorem mult_0_right:
    forall n: nat, n * 0 = 0.
    Proof.
    intros n.
    induction n as [| n' IHn'].
    - reflexivity.
    - simpl. rewrite IHn'. reflexivity.
    Qed.

Theorem add_shuffle3:
    forall n m p: nat, n + (m + p) = m + (n + p).
    Proof.
    intros n m p.
    assert (H:  n + m = m + n).
        { rewrite prove_addition_cummutative. reflexivity. }
    rewrite prove_addition_associative. rewrite prove_addition_associative. rewrite H. reflexivity.
    Qed.

Lemma mult_n_Sm: forall n m: nat,
    n * (S m) = n + n * m.
    Proof.
    intros n m.
    induction n as [| n' IHn'].
    - simpl. reflexivity.
    Abort.

Theorem mul_comm:
    forall n m: nat, n * m = m * n.
    Proof.
    intros n m.
    induction n as [| n' IHn'].
    - simpl. rewrite mult_0_right. reflexivity.
    - Abort.


Inductive natprod: Type :=
    | pair (n1 n2: nat).

Definition fst (p: natprod): nat :=
    match p with
    | pair x y => x
    end.

Check fst.
Compute fst (pair 10 49).

Definition snd (p: natprod): nat :=
    match p with
    | pair x y => y
    end.

Check snd.
Compute snd (pair 10 49).


Notation "( x , y )" := (pair x y).

Check (10, 20).

Definition swap_pair (p: natprod): natprod :=
    match p with
    | (x, y) => (y, x)
    end.
Compute swap_pair (pair 1 2).


(* Ill-formed pattern matching *)
(* Fixpoint minus (n m: nat): nat :=
    match n, m with
    | ( O, _ ) => O
    | (S _, O) => n
    | (S n', S m') => minus n' m'
    end. *)


(* Properties of pairs *)
Theorem surjective_pairing': forall (n m: nat),
    (n, m) = (fst (n, m), snd (n, m)).
    Proof.
    reflexivity.
    Qed.


Theorem surjective_pairing_stuck': forall (p: natprod),
    p = (fst p, snd p).
    Proof.
    intros.
    simpl. (* Doesn't reduce to anything *)
    Abort.

Theorem surjective_pairing: forall (p: natprod),
    p = (fst p, snd p).
    Proof.
    intros.
    destruct p as [n m].
    simpl. reflexivity.
    Qed.

(* Exercises *)
Theorem snd_fst_is_swap: forall (p: natprod),
    (snd p, fst p) = swap_pair p.
    Proof.
    intros.
    destruct p as [n m].
    simpl. reflexivity.
    Qed.


Theorem fst_swap_is_snd: forall (p: natprod),
    fst (swap_pair p) = snd p.
    Proof.
    intros.
    destruct p as [n m].
    simpl. reflexivity.
    Qed.

Check nil.

(* Definition the type of list of numbers *)
Inductive natlist: Type :=
    | nil
    | cons (n: nat) (l: natlist).

Definition list := cons 1.
Print list.
Check list.

Definition ll := list (cons 1 nil).
Print ll.
Check ll.

Definition l1 := cons 1 (cons 2 nil).
Print l1.
Check l1.

(* Introducing Notations of lists of nats *)
Notation "[ ]" := nil.
Notation " x :: l " := (cons x l) (at level 60, right associativity).
Notation "[ x ; .. ; y ]" := (cons x .. (cons y nil) ..).

Check [].
Check 1 :: 2 :: nil.
Check [1;2;3].


(* repeat *)
Fixpoint repeat (n count: nat): natlist :=
    match count with
    | O => nil
    | S count' => n :: (repeat n count')
    end.
Check repeat.
Compute repeat 1 10.


(* Length *)
Fixpoint length (l: natlist): nat :=
    match l with
    | [] => O (* matching with nil *)
    | h :: t => S (length t)
    end.
Check length.
Compute length [].
Compute length [1;1;1;1;1].

(* Append function *)
Fixpoint append (l1 l2: natlist): natlist :=
    match l1 with
    | [] => l2
    | h :: t => h :: (append t l2)
    end.
Check append.
Compute append [] [].
Compute append [] [1].
Compute append [1] [].
Compute append [1;2] [3;4;5].

Notation "x ++ y" := (append x y).

Example test_append': [1;2;3] ++ [4;5] = [1;2;3;4;5].
Proof. simpl. reflexivity. Qed.


Definition hd (default: nat) (l: natlist): nat :=
    match l with
    | [] => default
    | h :: t => h
    end.

Check hd.
Compute hd 100 [].
Compute hd 10 [45;46;47].


Definition tl (l: natlist): natlist :=
    match l with
    | [] => []
    | h :: t => t
    end.
Check tl.
Compute tl [].
Compute tl [1].
Compute tl [1;2].
Compute tl [1;2;3;4;5].


Fixpoint nonzeros (l: natlist): natlist :=
    match l with
    | [] => []
    | h :: t => match h with
                | O => nonzeros t
                | S _ => [h] ++ nonzeros t
                end
    end.


Check nonzeros.
Compute nonzeros [].
Compute nonzeros [0].
Compute nonzeros [0;1].


Example test_nonzeros: 
    nonzeros [0;1;0;2;0;3] = [1;2;3].
    Proof. simpl. reflexivity. Qed.

Require Import Arith.
Definition even' (n: nat): bool :=
    if n mod 2 then true else false.
Check even'.
Compute even' 2.

Fixpoint oddmembers (l: natlist): natlist :=
    match l with
    | [] => []
    | h :: t => if negb (even' h) then [h] ++ (oddmembers t) else (oddmembers t)
    end.
Check oddmembers.
Compute oddmembers [].
Compute oddmembers [0].
Compute oddmembers [1].

Example test_oddmembers:
    oddmembers [0;1;0;2;3;0;0] = [1;3].
    Proof. simpl. reflexivity. Qed.

Definition countoddmembers (l:natlist) : nat :=
    match l with
    | [] => 0
    | _ :: _ => length (oddmembers l)
    end.
Check countoddmembers.
Compute countoddmembers [].
Compute countoddmembers [1].

Example test_countoddmembers1:
    countoddmembers [1;0;3;1;4;5] = 4.
    Proof. simpl. reflexivity. Qed.

Example test_countoddmembers2:
    countoddmembers [0;2;4] = 0.
    Proof. simpl. reflexivity. Qed.

Example test_countoddmembers3:
    countoddmembers nil = 0.
    Proof. simpl. reflexivity. Qed.


Fixpoint alternate (l1 l2 : natlist) : natlist :=
    match l1, l2 with
    | [], [] => []
    | [], _ => l2
    | _, [] => l1
    | h1 :: t1, h2 :: t2 => [h1;h2] ++ (alternate t1 t2)
    end.
Check alternate.
Compute alternate [] [].
Compute alternate [1;2;3] [].
Compute alternate [] [1;2].
Compute alternate [1;2;3] [4;5;6].

Example test_alternate1:
    alternate [1;2;3] [4;5;6] = [1;4;2;5;3;6].
    Proof. simpl. reflexivity. Qed.

Example test_alternate2:
    alternate [1] [4;5;6] = [1;4;5;6].
    Proof. simpl. reflexivity. Qed.

Example test_alternate3:
    alternate [1;2;3] [4] = [1;4;2;3].
    Proof. simpl. reflexivity. Qed.

Example test_alternate4:
    alternate [] [20;30] = [20;30].
    Proof. simpl. reflexivity. Qed.


Definition bag := natlist.
Check bag.
Check natlist.

Require Import Nat.

Fixpoint count (v : nat) (s : bag) : nat :=
    match s with
    | [] => O
    | h :: t => (if eqb v h then 1 else O) + (count v t)
    end.
Check count.
Compute count 1 [].
Compute count 1 [2;3].
Compute count 2 [2;2;2;2].

Example test_count1: count 1 [1;2;3;1;4;1] = 3.
Proof. reflexivity. Qed.

Example test_count2: count 6 [1;2;3;1;4;1] = 0.
Proof. reflexivity. Qed.


(* Implementing sum function *)
(* This is similar to union in multiset *)
Definition sum (l1 l2: bag): bag :=
    l1 ++ l2.
Check sum.
Compute sum [] [].
Compute sum [1] [].
Compute sum [] [1].

Example test_sum1: count 1 (sum [1;2;3] [1;4;1]) = 3.
Proof. simpl. reflexivity. Qed.

Definition add (v : nat) (s : bag) : bag :=
    [v] ++ s.

Example test_add1: count 1 (add 1 [1;4;1]) = 3.
Proof. simpl. reflexivity. Qed.

Example test_add2: count 5 (add 1 [1;4;1]) = 0.
Proof. simpl. reflexivity. Qed.

Fixpoint member (v : nat) (s : bag) : bool :=
    match s with
    | [] => false
    | h :: t => if eqb v h then true else (member v t)
    end.
Example test_member1: member 1 [1;4;1] = true.
Proof. simpl. reflexivity. Qed.

Example test_member2: member 2 [1;4;1] = false.
Proof. simpl. reflexivity. Qed.


Fixpoint remove_one (v : nat) (s : bag) : bag :=
    match s with
    | [] => []
    | h :: t => if eqb v h then t else [h] ++ (remove_one v t)
    end.
Check remove_one.
Compute remove_one 1 [].
Compute remove_one 1 [1].
Compute remove_one 1 [1;2].
Compute remove_one 1 [2;1;2].
Compute remove_one 1 [2;3;4;5;6;100].
Compute remove_one 1 [2;3;4;1;5;6].
Compute remove_one 1 [2;3;4;5;6;1;1;101;7].

Example test_remove_one1:
    count 5 (remove_one 5 [2;1;5;4;1]) = 0.
    Proof. simpl. reflexivity. Qed.

Example test_remove_one2:
    count 5 (remove_one 5 [2;1;4;1]) = 0.
    Proof. simpl. reflexivity. Qed.

Example test_remove_one3:
    count 4 (remove_one 5 [2;1;4;5;1;4]) = 2.
    Proof. simpl. reflexivity. Qed.

Example test_remove_one4:
    count 5 (remove_one 5 [2;1;5;4;5;1;4]) = 1.
    Proof. simpl. reflexivity. Qed.

Fixpoint remove_all (v:nat) (s:bag) : bag :=
    match s with
    | [] => []
    | h :: t => if eqb v h then (remove_all v t) else [h] ++ remove_all v t
    end.
Example test_remove_all1: count 5 (remove_all 5 [2;1;5;4;1]) = 0.
    Proof. simpl. reflexivity. Qed.

Example test_remove_all2: count 5 (remove_all 5 [2;1;4;1]) = 0.
    Proof. simpl. reflexivity. Qed.

Example test_remove_all3: count 4 (remove_all 5 [2;1;4;5;1;4]) = 2.
    Proof. simpl. reflexivity. Qed.

Example test_remove_all4: count 5 (remove_all 5 [2;1;5;4;5;1;4;5;1;4]) = 0.
    Proof. simpl. reflexivity. Qed.

Fixpoint included (s1 : bag) (s2 : bag) : bool :=
    