# In order for this to work, you need to login to azure using the azure powershell cli and 
# set as default the subscription that contains your keyvault. 
# To list all subsciptions of current account -> az account list
# To change default subscription -> az account set --subscription <name or id>
# Then copy the content that is output in your .env file. 
# It contains all the secrets of the Keyvault
"The content will be copied to your clipboard once completed."
"You should paste the content to your .env file of your backend project under src folder."
$vaultName = Read-Host -Prompt "Please enter the vault name"

Write-Progress -Activity "Fetching keyvault data for keyvault $vaultName" -PercentComplete 0 -Status "Pending"
$secrets = az keyvault secret list --vault-name $vaultName
$secretsId = @()
$secrets | ConvertFrom-Json | ForEach-Object { 
    $secretsId += $_.id
} 
$lines = @()
$idx = 0
$secretsId | ForEach-Object {
    $percentComplete = ($idx / $secretsId.Count) * 100
    Write-Progress -Activity "Fetching keyvault data for keyvault $vaultName " -Status "Processing $percentComplete%" -PercentComplete $percentComplete

    $secret = az keyvault secret show --id $_ | ConvertFrom-Json
    $lines += $secret.name + "=" + $secret.value
    $idx++
}
"`n"
Set-Clipboard -Value $lines
$lines