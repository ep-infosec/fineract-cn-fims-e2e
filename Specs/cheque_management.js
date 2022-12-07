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
var Cheques = require('../Pages/Cheques');

describe('cheque_management', function() {
    var EC = protractor.ExpectedConditions;
    employeeIdentifier = helper.getRandomString(6);
    officeIdentifier = helper.getRandomString(6);
    officeIdentifier2 = helper.getRandomString(12);
    tellerIdentifier = helper.getRandomString(4);
    customerAccount = helper.getRandomString(5);
    customerAccount2 = helper.getRandomString(5);
    depositIdentifier = helper.getRandomString(5);
    depositName = helper.getRandomString(8);
    tellerAccount = helper.getRandomString(4);
    chequesReceivableAccount = helper.getRandomString(4);
    cashOverShortAccount = "COS_" + helper.getRandomString(4);
    revenueAccount = helper.getRandomString(4);
    loanShortName = helper.getRandomString(6);
    taskIdentifier = helper.getRandomString(3);
    loanAccountShortName =  helper.getRandomString(4);
    branchSortCode = helper.getRandomString(11);
    branchSortCode2 = helper.getRandomString(11);

    it('should create new accounts', function () {
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
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7200");
        Accounting.clickCreateNewAccountInLedger("7200");
        Accounting.enterTextIntoAccountIdentifierInputField(chequesReceivableAccount);
        Accounting.verifyRadioAssetToBeSelected();
        Accounting.verifyRadioAssetToBeDisabled();
        Accounting.enterTextIntoAccountNameInputField("Cheques Receivable");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("1000");
        Common.clickLinkShowForRowWithId("1300");
        Accounting.clickCreateNewAccountInLedger("1300");
        Accounting.enterTextIntoAccountIdentifierInputField(revenueAccount);
        Accounting.verifyRadioRevenueToBeSelected();
        Accounting.enterTextIntoAccountNameInputField("Revenue from deposit charges");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
        Accounting.goToAccountingViaSidePanel();
        Common.clickLinkShowForRowWithId("2000");
        Common.clickLinkShowForRowWithId("3300");
        Accounting.clickCreateNewAccountInLedger("3300");
        Accounting.enterTextIntoAccountIdentifierInputField(cashOverShortAccount);
        Accounting.verifyRadioExpenseToBeSelected();
        Accounting.enterTextIntoAccountNameInputField("Cash over short account");
        Accounting.clickButtonCreateAccount();
        Common.verifyMessagePopupIsDisplayed("Account is going to be saved");
    });
    it('should create a new employee with administrator permissions', function () {
        Employees.goToManageEmployeesViaSidePanel();
        Employees.createEmployee(employeeIdentifier, "Kate", "Atkinson", "Administrator", "abc123!!");
        Login.signOut();
        Login.logInForFirstTimeWithTenantUserAndPassword("playground", employeeIdentifier, "abc123!!", "abc123??");
    });
    it('should create a new branch office and a teller for the branch office', function () {
        Offices.goToManageOfficesViaSidePanel();
        Offices.clickButtonCreateNewOffice();
        Common.verifyCardHasTitle("Create new office");
        Offices.enterTextIntoOfficeIdentifierInputField(officeIdentifier);
        Offices.enterTextIntoOfficeNameInputField("Branch " + officeIdentifier);
        Offices.clickEnabledContinueButtonForOfficeDetails();
        Offices.clickCreateOfficeButton();
        Common.verifyMessagePopupIsDisplayed("Office is going to be saved");
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(officeIdentifier);
        Common.verifyFirstRowOfSearchResultHasTextAsId(officeIdentifier);
        Common.clickLinkShowForFirstRowInTable();
        Offices.goToManageTellersForOfficeByIdentifier(officeIdentifier);
        Offices.clickCreateTellerForOfficeByIdentifier(officeIdentifier);
        Offices.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Offices.enterTextIntoPasswordInputField("qazwsx123!!");
        Offices.enterTextIntoCashWithdrawalLimitInputField("1000");
        Offices.enterTextIntoTellerAccountInputFieldAndSelectMatchingEntry(tellerAccount);
        Offices.enterTextIntoVaultAccountInputFieldAndSelectMatchingEntry("7351");
        Offices.enterTextIntoChequesReceivableAccountInputFieldAndSelectMatchingEntry(chequesReceivableAccount);
        Offices.enterTextIntoCashOverShortInputFieldAndSelectMatchingEntry(cashOverShortAccount);
        Offices.clickCreateTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be saved");
        //workaround for current bug that teller is not always listed immediately
        Common.clickBackButtonInTitleBar();
        Offices.goToManageTellersForOfficeByIdentifier(officeIdentifier);
        //Offices.verifyTellerStatusIs("CLOSED");
        Common.clickLinkShowForFirstRowInTable();
    });
    it('should open the teller and assign it to an employee', function () {
        Offices.clickActionOpenForTellerOfOffice(tellerIdentifier, officeIdentifier);
        Offices.enterTextIntoAssignedEmployeeInputField(employeeIdentifier);
        Offices.selectOptionInListByName("Atkinson, Kate");
        Offices.clickEnabledOpenTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller is going to be updated");
        Offices.verifyTellerStatusIs("OPEN");
    });
    it('should create customer and activate customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.verifyCardHasTitle("Manage members");
        Customers.clickButtonOrLinkCreateNewMember();
        Common.verifyCardHasTitle("Create new member");
        Customers.enterTextIntoAccountInputField(customerAccount);
        Customers.enterTextIntoFirstNameInputField("Thomas");
        Customers.enterTextIntoLastNameInputField("Pynchon");
        Customers.enterTextIntoDayOfBirthInputField("9211978");
        Customers.verifyIsMemberCheckboxSelected();
        Customers.clickEnabledContinueButtonForMemberDetails();
        Customers.enterTextIntoStreetInputField("800 Chatham Road #326");
        Customers.enterTextIntoCityInputField("Winston-Salem");
        Customers.selectCountryByName("Germany");
        Customers.clickEnabledContinueButtonForMemberAddress();
        Customers.clickEnabledCreateMemberButton();
        Common.verifyMessagePopupIsDisplayed("Member is going to be saved")
        Common.verifyCardHasTitle("Manage members");
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount);
        Common.clickLinkShowForFirstRowInTable();
        Customers.verifyMemberHasStatusInactive();
        Customers.clickButtonGoToTasks();
        Customers.clickButtonActivate();
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Customers.verifyMemberHasStatusActive();
    });
    it('should create a deposit product and enable the product', function () {
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
        Deposits.enterTextIntoInterestInputField("3");
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
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Deposits.verifyProductHasStatusDisabled();
        Deposits.clickButtonEnableProduct();
        Common.verifyMessagePopupIsDisplayed("Product is going to be updated");
        Deposits.verifyProductHasStatusEnabled();
    });
    it('should assign deposit product to the customer and open the account', function () {
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
        //might not be in list immediately always
        Common.clickBackButtonInTitleBar();
        Customers.clickManageDepositAccountsForMember(customerAccount);
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Customers.verifyDepositAccountHasStatus("PENDING");
        Customers.verifyDepositAccountBalanceIs("0.00");
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoTellerNumberInputField(tellerIdentifier);
        Teller.enterTextIntoPasswordInputField("qazwsx123!!");
        Teller.clickEnabledUnlockTellerButton();
        Common.verifyMessagePopupIsDisplayed("Teller drawer unlocked");
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnOpenAccountForCustomer(customerAccount);
        Common.verifyCardHasTitle("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("500");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("500");
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should be able to cash cheque - cheque is not open/not on us', function () {
        //ToDo: workaround for bug; remove once fixed
        Teller.goToTellerManagementViaSidePanel();
        Teller.clickButtonShowAtIndex(0);
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("123456");
        Cheques.enterTextIntoBranchSortCodeInputField(branchSortCode);
        Cheques.enterTextIntoAccountNumberInputField("789789");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        //Issuing Bank/Issuer show error
        // Cheques.verifyIssuingBankHasError();
        // Cheques.verifyIssuerHasError();
        Cheques.enterTextIntoIssuingBankInputField("BoA");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        Cheques.enterTextIntoAmountInputField("5000");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("5000");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should be able to cash cheque - cheque is open/not on us', function () {
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("123456");
        Cheques.enterTextIntoBranchSortCodeInputField(branchSortCode2);
        Cheques.enterTextIntoAccountNumberInputField("789789");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        //Issuing Bank/Issuer show error
        Cheques.enterTextIntoIssuingBankInputField("BoA");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("9122017");
        Cheques.checkCheckboxIsChequeOpen();
        Cheques.verifyWarningIsNotDisplayedIfChequeIsOpen();
        Cheques.enterTextIntoAmountInputField("300");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("300");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('journal entries for transactions should be listed as expected', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifyFirstJournalEntry("Account Opening", "Amount: 500.00");
        Accounting.verifySecondJournalEntry("Order Cheque", "Amount: 5,000.00");
        Accounting.verifyThirdJournalEntry("Open Cheque", "Amount: 300.00");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7200");
        Common.clickLinkShowForRowWithId(chequesReceivableAccount);
        Accounting.viewAccountEntriesForAccount(chequesReceivableAccount);
        Accounting.verifyTransactionTypeForRow("DEBIT", 1);
        Accounting.verifyTransactionMessageForRow("ORCQ", 1);
        Accounting.verifyTransactionAmountForRow("5000", 1);
        Accounting.verifyTransactionBalanceForRow("5000", 1);
        Accounting.verifyTransactionTypeForRow("DEBIT", 2);
        Accounting.verifyTransactionMessageForRow("OPCQ", 2);
        Accounting.verifyTransactionAmountForRow("300", 2);
        Accounting.verifyTransactionBalanceForRow("5300", 2);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("CREDIT", 2);
        Accounting.verifyTransactionMessageForRow("ORCQ", 2);
        Accounting.verifyTransactionAmountForRow("5000", 2);
        Accounting.verifyTransactionBalanceForRow("5500", 2);
        Accounting.verifyTransactionTypeForRow("CREDIT", 3);
        Accounting.verifyTransactionMessageForRow("OPCQ", 3);
        Accounting.verifyTransactionAmountForRow("300", 3);
        Accounting.verifyTransactionBalanceForRow("5800", 3);
    });
    it('cheques should be pending clearance - approve first cheque/cancel second cheque', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToChequeClearing();
        Cheques.verifyStateForChequeWithIdentifier("PENDING", "123456~" + branchSortCode + "~789789");
        Cheques.verifyStateForChequeWithIdentifier("PENDING", "123456~" + branchSortCode2 + "~789789");
        Cheques.verifyDateIssuedForChequeWithIdentifier("9/9/2017", "123456~" + branchSortCode + "~789789");
        Cheques.verifyDateIssuedForChequeWithIdentifier("9/12/2017", "123456~" + branchSortCode + "~789789");
        Cheques.clickButtonApproveForChequeWithIdentifier("123456~" + branchSortCode + "~789789");
        Cheques.cancelAction();
        Cheques.clickButtonApproveForChequeWithIdentifier("123456~" + branchSortCode + "~789789");
        Cheques.confirmAction();
        Cheques.verifyStateForChequeWithIdentifier("PROCESSED", "123456~" + branchSortCode + "~789789");
        Cheques.clickButtonCancelForChequeWithIdentifier("123456~" + branchSortCode2 + "~789789");
        Cheques.confirmAction();
        Cheques.verifyStateForChequeWithIdentifier("CANCELED", "123456~" + branchSortCode2 + "~789789");
    });
    it('cheque should have been reverted as expected', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifyFourthJournalEntry("Cheque Reversal", "Amount: 300.00");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("7000");
        Common.clickLinkShowForRowWithId("7200");
        Common.clickLinkShowForRowWithId(chequesReceivableAccount);
        Accounting.viewAccountEntriesForAccount(chequesReceivableAccount);
        Accounting.verifyTransactionTypeForRow("CREDIT", 3);
        Accounting.verifyTransactionMessageForRow("CQRV", 3);
        Accounting.verifyTransactionAmountForRow("300", 3);
        Accounting.verifyTransactionBalanceForRow("5000", 3);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("DEBIT", 4);
        Accounting.verifyTransactionMessageForRow("CQRV", 4);
        Accounting.verifyTransactionAmountForRow("300", 4);
        Accounting.verifyTransactionBalanceForRow("5500", 4);
    });
    it('should create another customer', function () {
        Customers.goToManageCustomersViaSidePanel();
        Common.verifyCardHasTitle("Manage members");
        Customers.clickButtonOrLinkCreateNewMember();
        Common.verifyCardHasTitle("Create new member");
        Customers.enterTextIntoAccountInputField(customerAccount2);
        Customers.enterTextIntoFirstNameInputField("Cormac");
        Customers.enterTextIntoLastNameInputField("McCarthy");
        Customers.enterTextIntoDayOfBirthInputField("7281958");
        Customers.verifyIsMemberCheckboxSelected();
        Customers.clickEnabledContinueButtonForMemberDetails();
        Customers.enterTextIntoStreetInputField("800 Chatham Road #326");
        Customers.enterTextIntoCityInputField("Winston-Salem");
        Customers.selectCountryByName("Germany");
        Customers.clickEnabledContinueButtonForMemberAddress();
        Customers.clickEnabledCreateMemberButton();
        Common.verifyMessagePopupIsDisplayed("Member is going to be saved")
        Common.verifyCardHasTitle("Manage members");
        Common.clickSearchButtonToMakeSearchInputFieldAppear();
        Common.enterTextInSearchInputFieldAndApplySearch(customerAccount2);
        Common.verifyFirstRowOfSearchResultHasTextAsId(customerAccount2);
    });
    it('should activate the customer', function () {
        Common.clickLinkShowForFirstRowInTable();
        Customers.verifyMemberHasStatusInactive();
        Customers.clickButtonGoToTasks();
        Customers.clickButtonActivate();
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Customers.verifyMemberHasStatusActive();
    });
    it('should assign deposit product to customer and issue cheques to customer', function () {
        Customers.clickManageDepositAccountsForMember(customerAccount2);
        Customers.clickCreateDepositAccountForMember(customerAccount2);
        Customers.selectProduct(depositName);
        Customers.clickEnabledButtonCreateDepositAccount();
        Common.verifyMessagePopupIsDisplayed("Deposit account is going to be saved");
        //might not be in list immediately always
        Common.clickBackButtonInTitleBar();
        Customers.clickManageDepositAccountsForMember(customerAccount2);
        Common.clickLinkShowForRowWithId(depositIdentifier);
        Customers.verifyDepositAccountHasStatus("PENDING");
        Customers.verifyDepositAccountBalanceIs("0.00");
        Cheques.clickButtonIssueCheques();
        Cheques.enterTextIntoAmountInputField("200");
        Cheques.clickIssueChequesButton();
        Common.verifyMessagePopupIsDisplayed("Cheques are going to be issued");
    });
    it('customer should not be able to cash cheque - insufficient balance on issuer account', function () {
        //Or shouldn't he? Customer issuing the cheque has no money on his account; account isn't even open
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("200");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        Cheques.verifyIssuerHasText("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("250.54");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Cheque not covered.");
        Cheques.clickButtonOKInErrorMessage();
        //change branch sort code and verify transaction goes through as cheque not on us
        Cheques.enterTextIntoBranchSortCodeInputField("Nina");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("250.54");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });

    it('customer should be able to cash cheque - cheque is not open/on us', function () {
        //open customer's account with sufficient balance
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount2);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Cormac McCarthy");
        Teller.clickOnOpenAccountForCustomer(customerAccount2);
        Common.verifyCardHasTitle("Teller transaction");
        Teller.selectAccountToBeAffected(customerAccount2 + ".9100.00001(" + depositIdentifier +")");
        Teller.enterTextIntoAmountInputField("5000");
        Teller.clickEnabledCreateTransactionButton();
        Teller.verifyTransactionAmount("5000");
        Teller.clickEnabledConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("200");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        Cheques.verifyIssuerHasText("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("5000");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("5000");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
    });
    it('customer should not be able to cash same cheque', function () {
        //try and cash the same cheque again: determining from MICR should not be successful
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("200");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        Cheques.verifyPayeeHasTextAndCannotBeChanged("Thomas Pynchon");
        Cheques.enterTextIntoDateIssuedInputField("992017");
        Cheques.verifyWarningIsDisplayedIfChequeIsNotOpen();
        //Issuing Bank/Issuer have error
        // Cheques.verifyIssuingBankHasError();
        // Cheques.verifyIssuerHasError();
        //Manually enter information and try to cash check anyways
        Cheques.enterTextIntoIssuingBankInputField("Branch " + officeIdentifier);
        Cheques.enterTextIntoIssuerInputField("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("33");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Cheque 200~" + officeIdentifier + "~" + customerAccount2 + ".9100.00001 already used.");
        Cheques.clickButtonOKInErrorMessage();
        //change cheque number to a number that has not yet been issued for the customer
        Cheques.enterTextIntoChequeNumberInputField("201");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsDisplayedIfIssuingBankCouldNotBeDetermined();
        Cheques.verifyIssuingBankHasError();
        Cheques.verifyIssuerHasError();
        //change back to cheque number that has been issued for the customer and that has not yet been used
        Cheques.enterTextIntoChequeNumberInputField("199");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        Cheques.verifyIssuerHasText("Cormac McCarthy");
    });
    it('journal entries for the transaction should be listed as expected - cheque "on us"', function () {
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(customerAccount2 + ".9100.00001");
        Accounting.clickSearchButton();
        Accounting.verifySecondJournalEntry("Order Cheque", "Amount: 5,000.00");
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId("9000");
        Common.clickLinkShowForRowWithId("9100");
        Common.clickLinkShowForRowWithId(customerAccount2 + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount2 + ".9100.00001");
        Common.clickFirstColumnHeaderInTableToResortTable();
        Accounting.verifyTransactionTypeForRow("DEBIT", 1);
        Accounting.verifyTransactionMessageForRow("ORCQ", 1);
        Accounting.verifyTransactionAmountForRow("5000", 1);
        Accounting.verifyTransactionBalanceForRow("0", 1);
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId(customerAccount + ".9100.00001");
        Accounting.viewAccountEntriesForAccount(customerAccount + ".9100.00001");
        Accounting.verifyTransactionTypeForRow("CREDIT", 6);
        Accounting.verifyTransactionMessageForRow("ORCQ", 6);
        Accounting.verifyTransactionAmountForRow("5000", 6);
        Accounting.verifyTransactionBalanceForRow("10750.54", 6);
    });
    it('customer should not be able to cash cheque if account is locked - cheque is on us', function () {
        //lock second customer's account
        Common.clickBackButtonInTitleBar();
        Common.clickBackButtonInTitleBar();
        Common.clickLinkShowForRowWithId(customerAccount2 + ".9100.00001");
        Accounting.goToTasksForAccount(customerAccount2 + ".9100.00001");
        Accounting.clickButtonToExecuteAction("LOCK");
        Common.verifyMessagePopupIsDisplayed("Command is going to be executed");
        Accounting.verifyAccountStatus("LOCKED");
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnCashChequeForCustomer(customerAccount);
        Cheques.enterTextIntoChequeNumberInputField("11");
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00001");
        Cheques.clickButtonDetermineFromMICR();
        Cheques.verifyWarningIsNotDisplayedIfIssuingBankCouldBeDetermined();
        Cheques.enterTextIntoDateIssuedInputField("9152017");
        Cheques.verifyIssuingBankHasText("Branch " + officeIdentifier);
        Cheques.verifyIssuerHasText("Cormac McCarthy");
        Cheques.enterTextIntoAmountInputField("400");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001(" + depositIdentifier +")");
        Cheques.clickCreateTransactionButton();
        //verify transaction cannot be created if account is not open
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Account " + customerAccount2 + ".9100.00001 is not open.");
        Cheques.clickButtonOKInErrorMessage();
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.00005");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Account " + customerAccount2 + ".9100.00005 not found.");
        Cheques.clickButtonOKInErrorMessage();
        Cheques.enterTextIntoAccountNumberInputField(customerAccount2 + ".9100.0000");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Account " + customerAccount2 + ".9100.0000 not found.");
        Cheques.clickButtonOKInErrorMessage();
        //change branch sort code to a code that is not one of the office identifiers for the client and verify transaction goes through
        Cheques.enterTextIntoBranchSortCodeInputField("boa");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyTransactionAmount("400");
        Cheques.clickConfirmTransactionButton();
        Common.verifyMessagePopupIsDisplayed("Transaction successfully confirmed");
        Accounting.goToAccountingViaSidePanel();
        Accounting.goToChequeClearing();
        Cheques.verifyStateForChequeWithIdentifier("PENDING", "11~boa~" + customerAccount2 + ".9100.00005");
        Common.clickBackButtonInTitleBar();
        Accounting.goToJournalEntries();
        Accounting.enterTextIntoSearchAccountInputField(chequesReceivableAccount);
        Accounting.clickSearchButton();
        Accounting.verifyFifthJournalEntry("Order Cheque", "Amount: 400.00");
    });
    it('input should be validated and CREATE TRANSACTION button is only enabled with valid input', function () {
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount2);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Cormac McCarthy");
        //action to cash cheques is not yet visible for the customer because deposit account not active yet
        Teller.verifyActionCashChequeNotDisplayedForCustomer(customerAccount2);
        Teller.goToTellerManagementViaSidePanel();
        Teller.enterTextIntoSearchInputField(customerAccount);
        Teller.clickButtonShowAtIndex(0);
        Teller.verifyCardTitleHasNameOfCustomer("Thomas Pynchon");
        Teller.clickOnCashChequeForCustomer(customerAccount);
        //Cheque number is not a number
        Cheques.enterTextIntoChequeNumberInputField("c1");
        //Office identifier exceeds 11 characters
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier2);
        Cheques.enterTextIntoAccountNumberInputField(customerAccount + ".9100.00001");
        Cheques.verifyButtonDetermineFromMICRDisabled();
        Cheques.verifyChequeNumberInputHasErrorIfInputNoNumber();
        Cheques.verifyBranchSortCodeInputHasErrorIfCharacterLimitExceeded();
        //Issuing bank has special chars
        Cheques.enterTextIntoIssuingBankInputField("Unión de Crédito Español");
        Cheques.enterTextIntoIssuerInputField("Paul Auster");
        //Date should not be more than 6 months in the past
        Cheques.enterTextIntoDateIssuedInputField("8111999");
        Cheques.enterTextIntoAmountInputField("26.78");
        Cheques.selectAccountToTransferTo(customerAccount + ".9100.00001");
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoChequeNumberInputField("01");
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoBranchSortCodeInputField(officeIdentifier);
        Cheques.verifyButtonDetermineFromMICREnabled();
        Cheques.verifyCreateTransactionButtonIsEnabled();
        //amount is 0 or negative
        Cheques.enterTextIntoAmountInputField("0");
        Cheques.verifyAmountInputHasErrorIfInput0OrNegative();
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoAmountInputField("0.02");
        Cheques.verifyCreateTransactionButtonIsEnabled();
        Cheques.enterTextIntoAmountInputField("-4");
        Cheques.verifyAmountInputHasErrorIfInput0OrNegative();
        Cheques.verifyCreateTransactionButtonIsDisabled();
        Cheques.enterTextIntoAmountInputField("100,000.99");
        Cheques.clickCreateTransactionButton();
        Cheques.verifyErrorMessageDisplayedWithTitleAndText("Invalid transaction", "Cheque is older than 6 months.");
        Cheques.clickButtonOKInErrorMessage();
        //amount too high (bad request)
        //special chars in branch sort field (bad request)
    });
});