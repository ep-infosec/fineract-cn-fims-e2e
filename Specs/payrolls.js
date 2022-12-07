/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
//Prerequisites:
//Role "Administrator" and headquarter office already exist
//No tasks need to be executed in order to activate a customer
//ToDo: Figure out which roles best to use for which kind of actions instead of using employee with "Administrator" role

var helper = require('../helper.js');
var Login = require('../Pages/Login.js');
var Employees = require('../Pages/Employees.js');
var Common = require('../Pages/Common.js');
var Offices = require('../Pages/Offices');
var Teller = require('../Pages/Teller');
var Customers = require('../Pages/Customers');
var Deposits = require('../Pages/Deposits');
var Accounting = require('../Pages/Accounting');
var Payroll = require('../Pages/Payroll');

describe('payrolls', function() {
    var EC = protractor.ExpectedConditions;
    employeeIdentifier = helper.getRandomString(6);
    entryIdentifier = helper.getRandomString(6);
    customerAccount = helper.getRandomString(5);
    customerAccount2 = helper.getRandomString(5);
    depositIdentifier = helper.getRandomString(5);
    depositName = helper.getRandomString(8);
    tellerIdentifier = helper.getRandomString(4);
    chequeReceivablesAccount = "ChequeReceivables_" + helper.getRandomString(4);
    cashOverShortAccount = helper.getRandomString(4);
    payrollAccount = "Payroll_" + helper.getRandomString(4);
    tellerAccount = "Teller_" + helper.getRandomString(4);
    headquarterIdentifier = "hqo1";

    it('should create a new employees with administrator permissions', function () {
        Employees.goToManageEmployeesViaSidePanel();
        Employees.createEmployee(employeeIdentifier, "Paul", "Auster", "Administrator", "abc123!!");
        Login.signOut();
        Login.logInForFirstTimeWithTenantUserAndPassword("playground", employeeIdentifier, "abc123!!", "abc123??");
    });
    it('should create new accounts', function () {
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7200");
        Accounting.clickCreateNewAccountInLedger("7200");
        Accounting.enterTextIntoAccountIdentifierInputField(chequeReceivablesAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.verifyRadioAssetToBeDisabled();
        Accounting.enterTextIntoAccountNameInputField("Cheques Receivables");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7300");
        Accounting.clickCreateNewAccountInLedger("7300");
        Accounting.enterTextIntoAccountIdentifierInputField(tellerAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.verifyRadioAssetToBeDisabled();
        Accounting.enterTextIntoAccountNameInputField("My teller");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7300");
        Accounting.clickCreateNewAccountInLedger("7300");
        Accounting.enterTextIntoAccountIdentifierInputField(payrollAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.enterTextIntoAccountNameInputField("Cash account for payroll distributions");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("2000");
        Common.clickLinkShowForRowWithId("3300");
        Accounting.clickCreateNewAccountInLedger("3300");
        Accounting.enterTextIntoAccountIdentifierInputField(cashOverShortAccount);
        Accounting.enterTextIntoAccountNameInputField("Cash over short account");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
    });
    it('should transfer funds onto Payroll account', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.clickButtonAddJournalEntry();
        Accounting.enterTextIntoTransactionIdentifierInputField(entryIdentifier);
        Accounting.enterTextIntoTransactionTypeInputFieldAndSelectMatchingEntry("ACCT");
        Accounting.clickButtonContinue();
        Accounting.enterTextIntoDebitAccountNameInputField(payrollAccount);
        Accounting.enterTextIntoDebitAmountInputField("100000");
        Accounting.enterTextIntoCreditAccountNameInputField("9310");
        Accounting.enterTextIntoCreditAmountInputField("100000");
        Accounting.clickButtonCreateJournalEntry();
        Common.verifyMessagePopupIsDisplayed("Journal entry is going to be processed");
    });
    it('should be able to create customers', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.verifyCardHasTitle("Manage members");
        Customers.clickButtonOrLinkCreateNewMember();
        Common.verifyCardHasTitle("Create new member");
        Customers.enterTextIntoAccountInputField(customerAccount);
        Customers.enterTextIntoFirstNameInputField("Samuel");
        Customers.enterTextIntoLastNameInputField("Beckett");
        Customers.enterTextIntoDayOfBirthInputField("9211978");
        Customers.clickEnabledContinueButtonForMemberDetails();
        Customers.enterTextIntoStreetInputField("800 Chatham Road #326");
        Customers.enterTextIntoCityInputField("Winston-Salem");
        Customers.selectCountryByName("Germany");
        Customers.clickEnabledContinueButtonForMemberAddress();
        Customers.clickEnabledCreateMemberButton();
        Common.verifyMessagePopupIsDisplayed("Member is going to be saved");
        Common.verifyCardHasTitle("Manage members");
        Customers.createNewMember(customerAccount2, "Nina", "Delvos", "7112002", "Mulholland Road 1234", "City of Angels", "United States of America");
        //ToDo: verify you cannot set up payroll distribution for member that is not active yet; add here once ATEN-478 has been fixed
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.clickLinkShowForFirstRowInTable();
        Customers.clickButtonGoToTasks();
        Customers.clickButtonActivate();
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Customers.verifyMemberHasStatusActive();
    });
    it('should create a new teller for the branch office', function () {
        Offices.goToManageOfficesViaSidePanel();
        Offices.goToManageTellersForOfficeByIdentifier(headquarterIdentifier);
        Offices.clickCreateTellerForOfficeByIdentifier(headquarterIdentifier);
        Offices.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Offices.enterTextIntoPasswordInputField("qazwsx123!!");
        Offices.enterTextIntoCashWithdrawalLimitInputField("1000");
        Offices.enterTextIntoTellerAccountInputFieldAndSelectMatchingEntry(tellerAccount);
        Offices.enterTextIntoVaultAccountInputFieldAndSelectMatchingEntry("7351");
        Offices.enterTextIntoChequesReceivableAccountInputFieldAndSelectMatchingEntry(chequeReceivablesAccount);
        Offices.enterTextIntoCashOverShortInputFieldAndSelectMatchingEntry(cashOverShortAccount);
        Offices.clickCreateTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be saved");
        //workaround for current bug that teller is not always listed immediately
        Common.clickBackButtonInTitleBar();
        Offices.goToManageTellersForOfficeByIdentifier(headquarterIdentifier);
        Common.clickLinkShowForRowWithId(tellerIdentifier);
    });
    it('should open the teller and assign it to an employee', function () {
        Offices.clickActionOpenForTellerOfOffice(tellerIdentifier, headquarterIdentifier);
        Offices.enterTextIntoAssignedEmployeeInputField(employeeIdentifier);
        Offices.selectOptionInListByName("Auster, Paul");
        Offices.clickEnabledOpenTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be updated");
        Offices.verifyTellerStatusIs("OPEN");
    });
    it('should create a deposit product', function () {
        Deposits.goToDepositsViaSidePanel();
        Common.verifyCardHasTitle("Manage deposit products");
        Deposits.clickButtonCreateDepositAccount();
        Common.verifyCardHasTitle("Create new deposit product");
        Deposits.enterTextIntoShortNameInputField(depositIdentifier);
        Deposits.verifyRadioCheckingIsSelected();
        Deposits.enterTextIntoNameInputField(depositName);
        Deposits.enterTextIntoMinimumBalanceInputField("100");
        Deposits.verifyRadioAnnuallyIsSelected();
        Deposits.verifyCheckboxFlexibleInterestNotChecked();
        Deposits.enterTextIntoInterestInputField("0.05");
        Deposits.verifyFixedTermToggleSetToOff();
        Deposits.verifyTermPeriodInputFieldIsDisabled();
        Deposits.verifyRadioButtonsMonthAndYearDisabled();
        Deposits.toggleFixedTermToOn();
        Deposits.verifyTermPeriodInputFieldIsEnabled();
        Deposits.verifyRadioButtonsMonthAndYearEnabled();
        Deposits.selectRadioButtonYear();
        Deposits.enterTextIntoCashAccountInputField("7352");
        Deposits.enterTextIntoExpenseAccountInputField("2820");
        Deposits.enterTextIntoAccrueAccountInputField("8202");
        Deposits.enterTextIntoEquityLedgerInputField("9100");
        Deposits.enterTextIntoTermPeriodInputField("5");
        Deposits.selectRadioButtonYear();
        Deposits.clickEnabledContinueButtonForProductDetails();
        Deposits.clickEnabledCreateProductButton();
        Common.verifyMessagePopupIsDisplayed("Product is going to be saved");
        Common.verifyCardHasTitle("Manage deposit products");
    });
    it('should enable deposit product', function () {
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Deposits.verifyProductHasStatusDisabled();
        Deposits.clickButtonEnableProduct();
        Common.verifyMessagePopupIsDisplayed("Product is going to be updated");
        Deposits.verifyProductHasStatusEnabled();
    });
    it('should assign deposit account to customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Customers.clickCreateDepositAccountForMember(customerAccount);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
    });
    it('should assign another deposit account to customer', function () {
        Customers.clickCreateDepositAccountForMember(customerAccount);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
    });
    it('should be able to open account', function () {
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Teller.enterTextIntoPasswordInputField("qazwsx123!!");
        Teller.clickEnabledUnlockTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller drawer unlocked");
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Samuel Beckett");
        Teller.clickOnOpenAccountForCustomer(customerAccount);
        Common.verifyCardHasTitle("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("100");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("100");
        Teller.verifyChargesPayedInCashCheckboxChecked();
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
        Teller.clickOnOpenAccountForCustomer(customerAccount);
        Common.verifyCardHasTitle("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount + ".9100.00002(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("200");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("200");
        Teller.verifyChargesPayedInCashCheckboxChecked();
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('should not be able to select member without payroll distribution', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("SweetWater Brewing Company", 1);
        Payroll.verifyMemberInputFieldHasError("Invalid member or has no payroll created");
        Payroll.enterTextIntoSalaryInputFieldForPayment("5000", 1);
        Payroll.verifyCreatePaymentsButtonIsDisabled();
    });
    it('should set up payroll distribution for member - main account', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickPayrollForMember(customerAccount);
        Customers.clickEditPayrollDistributionForMember(customerAccount);
        Payroll.selectMainAccount(customerAccount + ".9100.00001(" + depositIdentifier + ")");
        Payroll.clickButtonUpdateAllocations();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be saved");
        //verify details
        Payroll.verifyPayrollInfo(customerAccount + ".9100.00001");
        //created by not updated yet
    });
    it('should pay salary - main account', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("SweetWater Brewing Company", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("5000", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        //verify details
        Payroll.verifyCreatedByForPayrollInRow(employeeIdentifier, 1);
        Payroll.verifyAccountNumberForPayrollInRow(payrollAccount, 1);
        //created by
        Common.clickLinkShowForRowWithId(employeeIdentifier);
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("SweetWater Brewing Company", 1);
        Payroll.verifySalaryForPaymentInRow("5000", 1);
    });
    it('verify transaction has been booked as expected', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifySecondJournalEntry("Payroll/Salary Payment", "Amount: 5,000.00");
        Accounting.clickSecondJournalEntry();
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "5,000.00", 1);
        Accounting.verifyAccountHasBeenCreditedWithAmountInRow(customerAccount + ".9100.00001", "5,000.00", 2);
        //customer has received payment
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Common.clickLinkShowForFirstRowInTable();
        Customers.verifyDepositAccountBalanceIs("5,100.00");
    });
    it('should update payroll allocation for member - one additional allocation (not proportional) ', function () {
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.clickButtonAddAllocations();
        //allocation account is the same as main account
        Payroll.selectAllocationAccountForAllocation(customerAccount + ".9100.00001", 1);
        Payroll.enterTextIntoAmountInputFieldForAllocation("1200", 1);
        Payroll.verifyErrorIsDisplayedIfSameAccountSelectedTwice();
        Payroll.verifyButtonUpdateAllocationsDisabled();
        Payroll.selectAllocationAccountForAllocation(customerAccount + ".9100.00002", 1);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        Payroll.clickButtonUpdateAllocations("Payroll is going to be saved");
    });
    it('should pay salary - main account & allocation (not proportional)', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("SweetWater Brewing Company", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("2000", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        //verify details
        Payroll.verifyCreatedByForPayrollInRow(employeeIdentifier, 1);
        Payroll.verifyAccountNumberForPayrollInRow(payrollAccount, 1);
        //created by
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("SweetWater Brewing Company", 1);
        Payroll.verifySalaryForPaymentInRow("2000", 1);
    });
    it('verify transaction has been booked as expected', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00002");
        Accounting.clickSearchButton();
        Accounting.verifySecondJournalEntry("Payroll/Salary Payment", "Amount: 2,000.00");
        Accounting.clickSecondJournalEntry();
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "2,000.00", 1);
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00001", "800.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00002", "1,200.00");
    });
    it('should update payroll allocation for member to proportional', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.checkCheckboxProportionalForAllocation(1);
        Payroll.enterTextIntoAmountInputFieldForAllocation("40.8", 1);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        Payroll.clickButtonUpdateAllocations("Payroll is going to be saved");
    });
    it('should pay salary - main account & allocation (proportional), two payments', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("SweetWater Brewing Company", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("1000", 1);
        Payroll.clickButtonAddPayment();
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 2);
        Payroll.enterTextIntoEmployerInputFieldForPayment("Ballast Point", 2);
        Payroll.enterTextIntoSalaryInputFieldForPayment("450", 2);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        //verify details
        Payroll.verifyCreatedByForPayrollInRow(employeeIdentifier, 1);
        Payroll.verifyAccountNumberForPayrollInRow(payrollAccount, 1);
        //created by
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("SweetWater Brewing Company", 1);
        Payroll.verifySalaryForPaymentInRow("1000", 1);
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 2);
        Payroll.verifyEmployerForPaymentInRow("Ballast Point", 2);
        Payroll.verifySalaryForPaymentInRow("450", 2);
    });
    it('verify transaction has been booked as expected - main account & one allocation, proportional', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00002");
        Accounting.clickSearchButton();
        Accounting.clickJournalEntry(3);
        Accounting.verifyThirdJournalEntry("Payroll/Salary Payment", "Amount: 1,000.00");
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount,  "1,000.00", 1);
        //ToDo: ATEN-477
        // Accounting.verifyAccountHasBeenCreditedWithAmountInRow(customerAccount + ".9100.00001", "591.00", 2);
        // Accounting.verifyAccountHasBeenCreditedWithAmountInRow(customerAccount + ".9100.00001", "409.00", 3);
        // Accounting.clickJournalEntry(4);
        // Accounting.verifyFourthJournalEntry("Payroll/Salary Payment", "Amount: 450.00");
        // Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        // Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        // Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount,  "450.00", 1);
        // Accounting.verifyAccountHasBeenCreditedWithAmountInRow(customerAccount + ".9100.00001", "265.95", 2);
        // Accounting.verifyAccountHasBeenCreditedWithAmountInRow(customerAccount + ".9100.00001", "184.05", 3);
    });
    it('should assign third deposit account to customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Customers.clickCreateDepositAccountForMember(customerAccount);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
    });
    it('should update payroll allocation for member - three accounts, proportional', function () {
        Common.clickBackButtonInTitleBar();
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.clickButtonAddAllocations();
        Payroll.verifyButtonUpdateAllocationsDisabled();
        Payroll.verifyAccountNotOfferedForSelection(customerAccount + ".9100.00003", 2);
        //same allocation account selected
        Payroll.selectAllocationAccountFromOpenList(customerAccount + ".9100.00002");
        Payroll.verifyErrorIsDisplayedIfSameAccountSelectedTwice();
        Payroll.clickButtonRemoveAllocation(2);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        //open account
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Samuel Beckett");
        Teller.clickOnOpenAccountForCustomer(customerAccount);
        Common.verifyCardHasTitle("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount + ".9100.00003(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("100");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("100");
        Teller.verifyChargesPayedInCashCheckboxChecked();
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
        //update payroll allocation
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.enterTextIntoAmountInputFieldForAllocation("30", 1);
        Payroll.clickButtonAddAllocations();
        Payroll.selectAllocationAccountForAllocation(customerAccount + ".9100.00003", 2);
        Payroll.checkCheckboxProportionalForAllocation(2);
        Payroll.enterTextIntoAmountInputFieldForAllocation("45", 2);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        Payroll.clickButtonUpdateAllocations("Payroll is going to be saved");
    });
    it('should pay salary - main account & 2 allocation (proportional)', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("Wicked Weed", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("888.88", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        //verify details
        Payroll.verifyCreatedByForPayrollInRow(employeeIdentifier, 1);
        Payroll.verifyAccountNumberForPayrollInRow(payrollAccount, 1);
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("Wicked Weed", 1);
        Payroll.verifySalaryForPaymentInRow("888.88", 1);
    });
    it('verify transaction has been booked as expected', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00003");
        Accounting.clickSearchButton();
        Accounting.verifySecondJournalEntry("Payroll/Salary Payment", "Amount: 888.88");
        Accounting.clickSecondJournalEntry();
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "888.88", 1);
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00001", "218.88");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00002", "270.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00003", "400.00");
    });
    it('should update payroll allocation for member - main account & two allocations (not proportional)', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.enterTextIntoAmountInputFieldForAllocation("2600", 1);
        Payroll.uncheckCheckboxProportionalForAllocation(1);
        Payroll.uncheckCheckboxProportionalForAllocation(2);
        Payroll.enterTextIntoAmountInputFieldForAllocation("25.50", 2);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        Payroll.clickButtonUpdateAllocations("Payroll is going to be saved");
    });
    it('should pay salary - main account & 2 allocation (not proportional)', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("New Belgium", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("3000", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        //verify details
        Payroll.verifyCreatedByForPayrollInRow(employeeIdentifier, 1);
        Payroll.verifyAccountNumberForPayrollInRow(payrollAccount, 1);
        //created by
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("New Belgium", 1);
        Payroll.verifySalaryForPaymentInRow("3000", 1);
    });
    it('verify transaction has been booked as expected', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00003");
        Accounting.clickSearchButton();
        Accounting.verifyThirdJournalEntry("Payroll/Salary Payment", "Amount: 3,000.00");
        Accounting.clickThirdJournalEntry();
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "3,000.00", 1);
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00001", "374.50");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00002", "2,600.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00003", "25.50");
    });
    it('should update payroll allocation for member - main account & two allocations (mixed)', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForRowWithId(customerAccount);
        Customers.clickPayrollForMember(customerAccount);
        Payroll.clickButtonEditPayrollDistribution(customerAccount);
        Payroll.checkCheckboxProportionalForAllocation(2);
        Payroll.enterTextIntoAmountInputFieldForAllocation("50", 2);
        Payroll.verifyButtonUpdateAllocationsEnabled();
        Payroll.clickButtonUpdateAllocations("Payroll is going to be saved");
    });
    it('should pay salary - main account & 2 allocation (mixed) - sufficient payment', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("Deschutes", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("6000", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("Deschutes", 1);
        Payroll.verifySalaryForPaymentInRow("6000", 1);
    });
    it('should pay salary - main account & 2 allocation (mixed) - exactly enough for allocations', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("Deschutes 2", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("5200", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("Deschutes 2", 1);
        Payroll.verifySalaryForPaymentInRow("5200", 1);
    });
    it('should pay salary - main account & 2 allocation (mixed) - insufficient payment', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToPayrolls();
        Payroll.clickButtonCreatePayroll();
        Payroll.enterTextIntoFromAccountInputFieldForPayment(payrollAccount);
        Payroll.enterTextIntoMemberInputFieldForPayment(customerAccount, 1);
        Payroll.enterTextIntoEmployerInputFieldForPayment("Deschutes 3", 1);
        Payroll.enterTextIntoSalaryInputFieldForPayment("5000", 1);
        Payroll.clickCreatePaymentsButton();
        Common.verifyMessagePopupIsDisplayed("Payroll is going to be created");
        Common.clickLinkShowForFirstRowInTable();
        //verify details
        Payroll.verifyMemberIDForPaymentInRow(customerAccount, 1);
        Payroll.verifyEmployerForPaymentInRow("Deschutes 3", 1);
        Payroll.verifySalaryForPaymentInRow("5000", 1);
    });
    it('verify transaction has been booked as expected - sufficient payment', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00003");
        Accounting.clickSearchButton();
        Accounting.verifyFourthJournalEntry("Payroll/Salary Payment", "Amount: 6,000.00");
        Accounting.clickJournalEntry(4);
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "6,000.00", 1);
        //order might change here
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00003", "3,000.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00002", "2,600.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00001", "400.00");
    });
    it('verify transaction has been booked as expected - payment exactly covering allocations', function () {
        //journal entry
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00003");
        Accounting.clickSearchButton();
        Accounting.verifyFifthJournalEntry("Payroll/Salary Payment", "Amount: 5,200.00");
        Accounting.clickJournalEntry(5);
        Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
        Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
        Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "5,200.00", 1);
        //order might change here
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00002", "2,600.00");
        Accounting.verifyAccountHasBeenCreditedWithAmount(customerAccount + ".9100.00003", "2,600.00");
    });
    // it('verify transaction has been booked as expected - payment insufficient to cover allocations', function () {
    //     //journal entry
    //     //ToDo: no journal entry exists, payment has not been made though created: ATEN-457
    //     Accounting.goToAccountingViaSidePanel();
    //     Accounting.goToJournalEntries();
    //     Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00003");
    //     Accounting.clickSearchButton();
    //     Accounting.clickJournalEntry(6);
    //     Accounting.verifyClerkForJournalEntryIs(employeeIdentifier);
    //     Accounting.verifyNoteForJournalEntryIs("Payroll Distribution");
    //     Accounting.verifyAccountHasBeenDebitedWithAmountInRow(payrollAccount, "5,000.00", 1);
    // });
    it('set up second member with deposit account and payroll distribution', function () {


    });
    it('make payments to two members at the same time', function () {


    });
    //closed dep account already selected for payroll; ATEN-461
    //allocations exceeding 100% (proportional); same behavior as above (ATEN-457)
});